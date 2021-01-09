import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";
import * as ecs from ".";
export declare abstract class Image implements ecs.ContainerImageProvider {
    abstract image(name: string, parent: pulumi.Resource): pulumi.Input<string>;
    abstract environment(name: string, parent: pulumi.Resource): pulumi.Input<ecs.KeyValuePair[]>;
    /**
     * Creates an [Image] given a path to a folder in which a Docker build should be run.
     *
     * Either a [name] or [repository] needs to be provided where the built image will be pushed
     * to.  If [repository] is provided, it will be used as-is.  Otherwise, a new one will be
     * created on-demand, using the [name] value.
     */
    static fromPath(name: string, path: pulumi.Input<string>): Image;
    static fromPath(repository: aws.ecr.Repository, path: pulumi.Input<string>): Image;
    /**
     * Creates an [Image] using the detailed build instructions provided in [build].
     *
     * Either a [name] or [repository] needs to be provided where the built image will be pushed
     * to.  If [repository] is provided, it will be used as-is.  Otherwise, a new one will be
     * created on-demand, using the [name] value.
     */
    static fromDockerBuild(name: string, build: pulumi.Input<docker.DockerBuild>): Image;
    static fromDockerBuild(repository: aws.ecr.Repository, build: pulumi.Input<docker.DockerBuild>): Image;
    /**
     * Creates an [Image] given function code to use as the implementation of the container.
     */
    static fromFunction(func: () => void): Image;
}
