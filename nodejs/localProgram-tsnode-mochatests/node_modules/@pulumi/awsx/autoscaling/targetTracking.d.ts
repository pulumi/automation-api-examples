import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export interface TargetTrackingPolicyArgs {
    /**
     * The estimated time, in seconds, until a newly launched instance will contribute CloudWatch
     * metrics. Without a value, AWS will default to the group's specified cooldown period.
     */
    estimatedInstanceWarmup?: pulumi.Input<number>;
    /**
     * Indicates whether scaling in by the target tracking scaling policy is disabled. If scaling in
     * is disabled, the target tracking scaling policy doesn't remove instances from the Auto
     * Scaling group. Otherwise, the target tracking scaling policy can remove instances from the
     * Auto Scaling group.  Defaults to [false] if unspecified.
     */
    disableScaleIn?: pulumi.Input<boolean>;
    /**
     * The target value for the metric.
     */
    targetValue: pulumi.Input<number>;
}
export interface ApplicationTargetGroupTrackingPolicyArgs extends TargetTrackingPolicyArgs {
    /**
     * The target group to scale [AutoScalingGroup] in response to number of requests to.
     * This must be a [TargetGroup] that the [AutoScalingGroup] was created with.  These can
     * be provided to the [AutoScalingGroup] using [AutoScalingGroupArgs.targetGroups].
     */
    targetGroup: x.lb.ApplicationTargetGroup;
}
/**
 * Represents a CloudWatch metric of your choosing for a target tracking scaling policy to use with
 * Amazon EC2 Auto Scaling.
 *
 * To create your customized metric specification:
 *
 *  * Add values for each required parameter from CloudWatch. You can use an existing metric, or a
 *    new metric that you create. To use your own metric, you must first publish the metric to
 *    CloudWatch. For more information, see
 *    [Publish-Custom-Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)
 *    in the Amazon CloudWatch User Guide.
 *
 *  * Choose a metric that changes proportionally with capacity. The value of the metric should
 *    increase or decrease in inverse proportion to the number of capacity units. That is, the value
 *    of the metric should decrease when capacity increases.
 */
export interface CustomMetricTargetTrackingPolicyArgs extends TargetTrackingPolicyArgs {
    /** The metric to track */
    metric: x.cloudwatch.Metric;
}
