import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
export declare class LifecyclePolicy extends aws.ecr.LifecyclePolicy {
    /**
     * Creates a new [LifecyclePolicy] for the given [repository].  If [args] is not provided, then
     * [getDefaultLifecyclePolicyArgs] will be used to set the default policy for this repo.
     */
    constructor(name: string, repository: aws.ecr.Repository, args?: LifecyclePolicyArgs, opts?: pulumi.ComponentResourceOptions);
    /**
     * Creates a default lifecycle policy such that at most a single untagged image is retained. All
     * tagged layers and images will never expire.
     */
    static defaultLifecyclePolicyArgs(): LifecyclePolicyArgs;
}
/**
 * See https://docs.aws.amazon.com/AmazonECR/latest/userguide/lifecycle_policy_examples.html for
 * more details.
 */
export interface LifecyclePolicyArgs {
    /**
     * Specifies the rules to determine how images should be retired from this repository. Rules are
     * ordered from lowest priority to highest.  If there is a rule with a `selection` value of
     * `any`, then it will have the highest priority.
     */
    rules: pulumi.Input<pulumi.Input<LifecyclePolicyRule>[]>;
}
/**
 * The following behaviors hold for these rules:
 *
 *  * An image is expired by exactly one or zero rules.
 *
 *  * An image that matches the tagging requirements of a higher priority rule cannot be expired by
 *    a rule with a lower priority.
 *
 *  * Rules can never mark images that are marked by higher priority rules, but can still identify
 *    them as if they haven't been expired.
 *
 *  * The set of rules must contain a unique set of tag prefixes.
 *
 *  * Only one rule is allowed to select `untagged` images.
 *
 *  * Expiration is always ordered by pushed_at_time, and always expires older images before newer
 *    ones.
 *
 *  * When using the `tagPrefixList`, an image is successfully matched if all of the tags in the
 *    `tagPrefixList` value are matched against any of the image's tags.
 *
 *  * With `maximumNumberOfImages`, images are sorted from youngest to oldest based on
 *    pushed_at_time and then all images greater than the specified count are expired.
 *
 *  * With `maximumAgeLimit`, all images whose pushed_at_time is older than the specified number of
 *    days based on countNumber are expired.
 */
export interface LifecyclePolicyRule {
    /**
     * Describes the purpose of a rule within a lifecycle policy.
     */
    description?: pulumi.Input<string>;
    /**
     * Determines whether the lifecycle policy rule that you are adding specifies a tag for an
     * image. If you specify `any`, then all images have the rule applied to them. If you specify
     * `untagged` then the rule will only apply to untagged images.  Otherwise, you can specify a
     * `tagPrefixList` value.
     */
    selection: pulumi.Input<"untagged" | "any" | {
        /**
         * A list of image tag prefixes on which to take action with your lifecycle policy. For
         * example, if your images are tagged as `prod`, `prod1`, `prod2`, and so on, you would use
         * the tag prefix `prod` to specify all of them. If you specify multiple tags, only the
         * images with all specified tags are selected.
         */
        tagPrefixList: pulumi.Input<pulumi.Input<string>[]>;
    }>;
    /**
     * The maximum number of images that you want to retain in your repository.  Either
     * [maximumNumberOfImages] or [maximumAgeLimit] must be provided.
     */
    maximumNumberOfImages?: pulumi.Input<number>;
    /**
     * The maximum age limit (in days) for your images.  Either [maximumNumberOfImages] or
     * [maximumAgeLimit] must be provided.
     */
    maximumAgeLimit?: pulumi.Input<number>;
}
