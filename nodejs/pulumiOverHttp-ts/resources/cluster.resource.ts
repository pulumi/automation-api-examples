import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export class ClusterResource extends ComponentResource {
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
