import * as pulumi from "@pulumi/pulumi";
/**
 * Tags represents a set of key-value string pairs to which can be applied
 * to an AWS resource.
 */
export interface Tags {
    [name: string]: pulumi.Input<string>;
}
