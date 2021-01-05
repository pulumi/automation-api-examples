import {
  LocalWorkspace,
  ConcurrentUpdateError,
  StackAlreadyExistsError,
  StackNotFoundError,
} from "@pulumi/pulumi/x/automation";
import * as express from "express";
import * as k8s from "@pulumi/kubernetes";
import { ClusterResource } from "./resources/cluster.resource";
import { SharedResource } from "./resources/shared.resource";

const projectName = "pulumi_over_http";

// this function defines our pulumi S3 static website in terms of the content that the caller passes in.
// this allows us to dynamically deploy websites based on user defined values from the POST body.
const createPulumiProgram = (content: string) => async () => {
  const cluster = new ClusterResource("pulumitest", {
    provider: "GKE",
    zone: "europe-west1-b",
    size: "SMALL",
  });

  const provider = new k8s.Provider("k8s", { kubeconfig: cluster.kubeconfig });

  const shared = new SharedResource("pulumitest", {
    parent: cluster,
    provider: provider,
  });

  return {
    kubeconfig: cluster.kubeconfig,
    provider,
    shared,
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
    res.json({ id: stackName, outputs: upRes.outputs });
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
