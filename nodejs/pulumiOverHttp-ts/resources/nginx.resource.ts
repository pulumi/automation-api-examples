import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { ComponentResource } from "@pulumi/pulumi";

export class NginxIngressResource extends ComponentResource {
  public ingressEndpoint: pulumi.Output<string>;

  constructor(
    name: string,
    namespace: string,
    opts: pulumi.ComponentResourceOptions = {}
  ) {
    super("launchpad:chart:nginx-ingress", name, {}, { ...opts });

    const settings = {
      chart: "ingress-nginx",
      version: "3.15.2",
      fetchOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
      },
      namespace: namespace,
      values: {
        controller: {
          config: {
            "nginx-status-ipv4-whitelist": "0.0.0.0",
            "http-snippet": `
                  server {
                      listen 18080;
                      location /nginx_status {
                          allow all;
                          stub_status on;
                      }
                      location / {
                          return 404;
                      }
                  }`,
          },
          podLabels: {
            "tags.datadoghq.com/env": namespace,
            "tags.datadoghq.com/service": "nginx-ingress",
            "tags.datadoghq.com/version": "3.15.2",
          },
          scope: {
            enabled: false,
          },
          extraEnvs: [
            {
              name: "DD_ENV",
              valueFrom: {
                fieldRef: {
                  fieldPath: `metadata.labels['tags.datadoghq.com/env']`,
                },
              },
            },
            {
              name: "DD_SERVICE",
              valueFrom: {
                fieldRef: {
                  fieldPath: `metadata.labels['tags.datadoghq.com/service']`,
                },
              },
            },
            {
              name: "DD_VERSION",
              valueFrom: {
                fieldRef: {
                  fieldPath: `metadata.labels['tags.datadoghq.com/version']`,
                },
              },
            },
          ],
          extraArgs: {
            "default-ssl-certificate": `${namespace}/wildcard-ssl`,
          },
          annotations: {
            "ad.datadoghq.com/controller.check_names": `["nginx","nginx_ingress_controller"]`,
            "ad.datadoghq.com/controller.init_configs": `[{},{}]`,
            "ad.datadoghq.com/controller.instances": `[{"nginx_status_url": "http://%%host%%:18080/nginx_status"},{"prometheus_url": "http://%%host%%:10254/metrics"}]`,
            "ad.datadoghq.com/controller.logs": `[{"service": "controller", "source": "nginx-ingress-controller"}]`,
          },
          podAnnotations: {
            "ad.datadoghq.com/controller.check_names": `["nginx","nginx_ingress_controller"]`,
            "ad.datadoghq.com/controller.init_configs": `[{},{}]`,
            "ad.datadoghq.com/controller.instances": `[{"nginx_status_url": "http://%%host%%:18080/nginx_status"},{"prometheus_url": "http://%%host%%:10254/metrics"}]`,
            "ad.datadoghq.com/controller.logs": `[{"service": "controller", "source": "nginx-ingress-controller"}]`,
          },
          replicaCount: 2,
          metrics: {
            enabled: true,
          },
          admissionWebhooks: {
            enabled: false,
          },
        },
      },
    };

    const nginxIngress = new k8s.helm.v3.Chart(name, settings, {
      provider: opts.provider,
      parent: this,
      ignoreChanges: ["status", "metadata"],
    });

    const controllerService = nginxIngress.getResource(
      "v1/Service",
      settings.namespace,
      `${settings.namespace}-nginx-ingress-ingress-nginx-controller`
    );

    this.ingressEndpoint = controllerService.status.apply(
      (status) =>
        status.loadBalancer.ingress[0].ip ??
        status.loadBalancer.ingress[0].hostname
    );
  }
}
