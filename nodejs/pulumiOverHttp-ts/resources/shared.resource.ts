import * as k8s from "@pulumi/kubernetes";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";
import { NginxIngressResource } from "./nginx.resource";

export class SharedResource extends ComponentResource {
  constructor(name: string, opts: ComponentResourceOptions = {}) {
    super("bpaas:shared", name, {}, { ...opts });

    const namespace = new k8s.core.v1.Namespace(
      `${name}-namespace`,
      { metadata: { name: name } },
      { provider: opts.provider, parent: this }
    );

    const ingress = new NginxIngressResource(`${name}-nginx-ingress`, name, {
      provider: opts.provider,
      parent: namespace,
    });
  }
}
