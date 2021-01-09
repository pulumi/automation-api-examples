import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as api from "./api";
import { SecurityDefinition } from "./swagger_json";
/**
 * Input properties for creating a UsagePlan and associated API Keys.
 */
export interface APIKeyArgs {
    /**
     * Define the apis you would like to associate the usage plan with. This can be used in place of
     * defining the apiStages defined in the [usagePlan]. You cannot define both [apis] and
     * [usagePlan.apiStages].
     */
    apis?: api.API[];
    /**
     * Define the usage plan to create. You can either define:
     *  1. an existing Usage Plan - the API Keys will be associated with the usage plan
     *  2. UsagePlanArgs with [usagePlan.apiStages] defined to define a new Usage Plan
     *  3. UsagePlanArgs with [apis] defined and [usagePlan.apiStages] NOT defined to define a new
     *      Usage Plan
     *  4. Nothing - if you do not specify [apis] and pass in an empty object, a new usage plan will
     *     be created on your behalf with the all the default values.
     */
    usagePlan?: aws.apigateway.UsagePlan | aws.apigateway.UsagePlanArgs;
    /**
     * The API keys you would like to create & associate with the usage plan. You can pass an array
     *  that has a combination of:
     *  1. an existing APIKey
     *  2. ApiKeyArgs for a new APIKey
     */
    apiKeys?: Array<aws.apigateway.ApiKey | aws.apigateway.ApiKeyArgs>;
}
/**
 * The associate api keys and the usage plan as created by the `createAssociatedAPIKeys` function.
 */
export interface AssociatedAPIKeys {
    /**
     * Either the `aws.apigateway.UsagePlan` created for you, or the usage plan passed to as part of
     * the `APIKeyArgs`.
     */
    readonly usagePlan: aws.apigateway.UsagePlan;
    /**
     * The keys that were associated with the usage plan.
     */
    readonly keys: Key[];
}
/**
 * A key represents an `aws.apigateway.ApiKey` and the `aws.apigateway.UsagePlanKey` that ties it to
 * a usage plan.
 */
export interface Key {
    /**
     * apikey is either a `aws.apigateway.ApiKey` passed in or the `aws.apigateway.ApiKey` created
     * on your behalf using the `ApiKeyArgs`
     */
    apikey: aws.apigateway.ApiKey;
    /**
     * usagePlanKey is created on your behalf to associate the apikey with the usage plan.
     */
    usagePlanKey: aws.apigateway.UsagePlanKey;
}
/**
 * Helper function that allows you to quickly create API Keys and associate them with an API.
 *
 * @param name The _unique_ name of the resource.
 * @param args The arguments to use to populate this resource's properties.
 */
export declare function createAssociatedAPIKeys(name: string, args: APIKeyArgs, opts?: pulumi.CustomResourceOptions): AssociatedAPIKeys;
export declare const apiKeySecurityDefinition: SecurityDefinition;
