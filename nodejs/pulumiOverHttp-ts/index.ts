import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";
import {
  LocalWorkspace,
  ConcurrentUpdateError,
  StackAlreadyExistsError,
  StackNotFoundError,
} from "@pulumi/pulumi/x/automation";
import { s3 } from "@pulumi/aws";
import { PolicyDocument } from "@pulumi/aws/iam";
import * as express from "express";
import { autoscaling } from "@pulumi/aws/types/enums";
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

const projectName = "pulumi_over_http";

// this function defines our pulumi S3 static website in terms of the content that the caller passes in.
// this allows us to dynamically deploy websites based on user defined values from the POST body.
const createPulumiProgram = (content: string) => async () => {
  // Create a GCP cluster Resource
  class ClusterResource extends ComponentResource {
    public kubeconfig: Output<string>;

    constructor(
      name: string,
      settings: {
        provider: string;
        zone: string;
        size: string;
      },
      opts: ComponentResourceOptions = {}
    ) {
      super("bpaas:cluster", name, {}, { ...opts });
      const { provider, zone, size } = settings;

      switch (provider) {
        case "GKE": {
          this.gkeCluster(name, zone, size);
          break;
        }
        default: {
          throw new Error(`Unknown cluster provider! ${provider}`);
        }
      }
    }

    private gkeCluster(name: string, zone: string, size: string) {
      // Find the latest GKE Version
      const engineVersion = gcp.container
        .getEngineVersions({ location: zone })
        .then((v) => v.latestMasterVersion);
      // Build the GKE cluster
      const cluster = new gcp.container.Cluster(
        name,
        {
          location: zone,
          minMasterVersion: engineVersion,
          nodeVersion: engineVersion,
          nodePools: [
            {
              nodeConfig: {
                machineType: "e2-standard-2",
                diskType: "pd-ssd",
                diskSizeGb: 20,
                shieldedInstanceConfig: {
                  enableIntegrityMonitoring: true,
                },
                oauthScopes: [
                  "https://www.googleapis.com/auth/compute",
                  "https://www.googleapis.com/auth/devstorage.read_only",
                  "https://www.googleapis.com/auth/logging.write",
                  "https://www.googleapis.com/auth/monitoring",
                ],
              },
              autoscaling: {
                minNodeCount: 1,
                maxNodeCount: 2,
              },
              initialNodeCount: 1,
              management: {
                autoUpgrade: true,
                autoRepair: true,
              },
              upgradeSettings: {
                maxSurge: 2,
                maxUnavailable: 1,
              },
            },
          ],
          addonsConfig: {
            httpLoadBalancing: {
              disabled: false,
            },
            horizontalPodAutoscaling: {
              disabled: true,
            },
            dnsCacheConfig: {
              enabled: false,
            },
          },
          clusterAutoscaling: {
            enabled: false,
            autoscalingProfile: "OPTIMIZE_UTILIZATION",
          },
          verticalPodAutoscaling: {
            enabled: true,
          },
          enableShieldedNodes: true,
          clusterTelemetry: {
            type: "ENABLED",
          },
          masterAuth: {
            clientCertificateConfig: {
              issueClientCertificate: true,
            },
          },
        },
        {
          ignoreChanges: ["initialNodeCount"],
          parent: this,
        }
      );
      // Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
      // because of the way GKE requires gcloud to be in the picture for cluster
      // authentication (rather than using the client cert/key directly).
      this.kubeconfig = pulumi
        .all([cluster.name, cluster.endpoint, cluster.masterAuth])
        .apply(([name, endpoint, masterAuth]) => {
          const context = `${name}_${zone}`;
          return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
        });
    }
  }

  const cluster = new ClusterResource("pulumitest", {
    provider: "GKE",
    zone: "europe-west1-b",
    size: "SMALL",
  });

  return {
    kubeconfig: cluster.kubeconfig,
  };
};
// creates new sites
const createHandler: express.RequestHandler = async (req, res) => {
  const stackName = req.body.id;
  const content = req.body.content as string;
  try {
    // create a new stack
    const stack = await LocalWorkspace.createStack({
      stackName,
      projectName,
      // generate our pulumi program on the fly from the POST body
      program: createPulumiProgram(content),
    });
    await stack.setConfig("aws:region", { value: "us-west-2" });
    // deploy the stack, tailing the logs to console
    const upRes = await stack.up({ onOutput: console.info });
    res.json({ id: stackName, kubeconfig: upRes.outputs.kubeconfig });
  } catch (e) {
    if (e instanceof StackAlreadyExistsError) {
      res.status(409).send(`stack "${stackName}" already exists`);
    } else {
      res.status(500).send(e);
    }
  }
};
// lists all sites
const listHandler: express.RequestHandler = async (req, res) => {
  try {
    // set up a workspace with only enough information for the list stack operations
    const ws = await LocalWorkspace.create({
      projectSettings: { name: projectName, runtime: "nodejs" },
    });
    const stacks = await ws.listStacks();
    res.json({ ids: stacks.map((s) => s.name) });
  } catch (e) {
    res.status(500).send(e);
  }
};
// gets info about a specific site
const getHandler: express.RequestHandler = async (req, res) => {
  const stackName = req.params.id;
  try {
    // select the existing stack
    const stack = await LocalWorkspace.selectStack({
      stackName,
      projectName,
      // don't need a program just to get outputs
      program: async () => {},
    });
    const outs = await stack.outputs();
    res.json({ id: stackName, url: outs.websiteUrl.value });
  } catch (e) {
    if (e instanceof StackNotFoundError) {
      res.status(404).send(`stack "${stackName}" does not exist`);
    } else {
      res.status(500).send(e);
    }
  }
};
// updates the content for an existing site
const updateHandler: express.RequestHandler = async (req, res) => {
  const stackName = req.params.id;
  const content = req.body.content as string;
  try {
    // select the existing stack
    const stack = await LocalWorkspace.selectStack({
      stackName,
      projectName,
      // generate our pulumi program on the fly from the POST body
      program: createPulumiProgram(content),
    });
    await stack.setConfig("aws:region", { value: "us-west-2" });
    // deploy the stack, tailing the logs to console
    const upRes = await stack.up({ onOutput: console.info });
    res.json({ id: stackName, url: upRes.outputs.websiteUrl.value });
  } catch (e) {
    if (e instanceof StackNotFoundError) {
      res.status(404).send(`stack "${stackName}" does not exist`);
    } else if (e instanceof ConcurrentUpdateError) {
      res
        .status(409)
        .send(`stack "${stackName}" already has update in progress`);
    } else {
      res.status(500).send(e);
    }
  }
};
// deletes a site
const deleteHandler: express.RequestHandler = async (req, res) => {
  const stackName = req.params.id;
  try {
    // select the existing stack
    const stack = await LocalWorkspace.selectStack({
      stackName,
      projectName,
      // don't need a program for destroy
      program: async () => {},
    });
    // deploy the stack, tailing the logs to console
    await stack.destroy({ onOutput: console.info });
    await stack.workspace.removeStack(stackName);
    res.status(200).end();
  } catch (e) {
    if (e instanceof StackNotFoundError) {
      res.status(404).send(`stack "${stackName}" does not exist`);
    } else if (e instanceof ConcurrentUpdateError) {
      res
        .status(409)
        .send(`stack "${stackName}" already has update in progress`);
    } else {
      res.status(500).send(e);
    }
  }
};
const ensurePlugins = async () => {
  const ws = await LocalWorkspace.create({});
  await ws.installPlugin("aws", "v3.2.1");
};

// install necessary plugins once upon boot
ensurePlugins();

// configure express
const app = express();
app.use(express.json());

// setup our RESTful routes for our Site resource
app.post("/sites", createHandler);
app.get("/sites", listHandler);
app.get("/sites/:id", getHandler);
app.put("/sites/:id", updateHandler);
app.delete("/sites/:id", deleteHandler);

// start our http server
app.listen(1337, () => console.info("server running on :1337"));
