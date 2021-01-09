import * as pulumi from "@pulumi/pulumi";
import * as ecs from "../ecs";
import { Repository } from "./repository";
/**
 * A simple pair of a [Repository] and a built docker image that was pushed to it.  This can
 * be passed in as the `image: repoImage` value to an `ecs.Container`.
 */
export declare class RepositoryImage implements ecs.ContainerImageProvider {
    readonly repository: Repository;
    readonly imageValue: pulumi.Input<string>;
    constructor(repository: Repository, image: pulumi.Input<string>);
    image: () => pulumi.Input<string>;
    environment: () => never[];
}
