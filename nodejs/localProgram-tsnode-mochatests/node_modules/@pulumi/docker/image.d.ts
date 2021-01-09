import * as pulumi from "@pulumi/pulumi";
import * as docker from "./docker";
/**
 * Arguments for constructing an Image resource.
 */
export interface ImageArgs {
    /**
     * The qualified image name that will be pushed to the remote registry.  Must be a supported
     * image name for the target registry user.  This name can include a tag at the end.  If
     * provided all pushed image resources will contain that tag as well.
     *
     * Either [imageName] or [localImageName] can have a tag.  However, if both have a tag, then
     * those tags must match.
     */
    imageName: pulumi.Input<string>;
    /**
     * The Docker build context, as a folder path or a detailed DockerBuild object.
     */
    build: pulumi.Input<string | docker.DockerBuild>;
    /**
     * The docker image name to build locally before tagging with imageName.  If not provided, it
     * will be given the value of to [imageName].  This name can include a tag at the end.  If
     * provided all pushed image resources will contain that tag as well.
     *
     * Either [imageName] or [localImageName] can have a tag.  However, if both have a tag, then
     * those tags must match.
     */
    localImageName?: pulumi.Input<string>;
    /**
     * Credentials for the docker registry to push to.
     */
    registry?: pulumi.Input<ImageRegistry>;
    /**
     * Skip push flag.
     */
    skipPush?: boolean;
}
export interface ImageRegistry {
    /**
     * Docker registry server URL to push to.  Some common values include:
     * DockerHub: `docker.io` or `https://index.docker.io/v1`
     * Azure Container Registry: `<name>.azurecr.io`
     * AWS Elastic Container Registry: `<account>.dkr.ecr.us-east-2.amazonaws.com`
     * Google Container Registry: `<name>.gcr.io`
     */
    server: pulumi.Input<string>;
    /**
     * Username for login to the target Docker registry.
     */
    username: pulumi.Input<string>;
    /**
     * Password for login to the target Docker registry.
     */
    password: pulumi.Input<string>;
}
/**
 * A docker.Image resource represents a Docker image built locally which is published and made
 * available via a remote Docker registry.  This can be used to ensure that a Docker source
 * directory from a local deployment environment is built and pushed to a cloud-hosted Docker
 * registry as part of a Pulumi deployment, so that it can be referenced as an image input from
 * other cloud services that reference Docker images - including Kubernetes Pods, AWS ECS Tasks, and
 * Azure Container Instances.
 */
export declare class Image extends pulumi.ComponentResource {
    /**
     * The base image name that was built and pushed.  This does not include the id annotation, so
     * is not pinned to the specific build performed by this docker.Image.
     */
    baseImageName: pulumi.Output<string>;
    /**
     * The unique pinned image name on the remote repository.
     */
    imageName: pulumi.Output<string>;
    /**
     * The server the image is located at.
     */
    registryServer: pulumi.Output<string | undefined>;
    /** @deprecated This will have the same value as [imageName], but will be removed in the future. */
    id: pulumi.Output<string>;
    /**
     * @deprecated This will have the same value as [imageName], but will be removed in the future.
     * It can be used to get a unique name for this specific image, but is not the actual repository
     * digest value.
     */
    digest: pulumi.Output<string | undefined>;
    constructor(name: string, args: ImageArgs, opts?: pulumi.ComponentResourceOptions);
}
