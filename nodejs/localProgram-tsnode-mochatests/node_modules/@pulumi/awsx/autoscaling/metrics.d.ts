import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface AutoScalingMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Group] to filter down events to.
         */
        group?: aws.autoscaling.Group;
    }
    /**
     * The minimum size of the Auto Scaling group.
     */
    function groupMinSize(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The maximum size of the Auto Scaling group.
     */
    function groupMaxSize(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The number of instances that the Auto Scaling group attempts to maintain.
     */
    function groupDesiredCapacity(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The number of instances that are running as part of the Auto Scaling group. This metric does not
     * include instances that are pending or terminating.
     */
    function groupInServiceInstances(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The number of instances that are pending. A pending instance is not yet in service. This metric
     * does not include instances that are in service or terminating.
     */
    function groupPendingInstances(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The number of instances that are in a Standby state. Instances in this state are still running
     * but are not actively in service.
     */
    function groupStandbyInstances(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The number of instances that are in the process of terminating. This metric does not include
     * instances that are in service or pending.
     */
    function groupTerminatingInstances(change?: AutoScalingMetricChange): cloudwatch.Metric;
    /**
     * The total number of instances in the Auto Scaling group. This metric identifies the number of
     * instances that are in service, pending, and terminating.
     */
    function groupTotalInstances(change?: AutoScalingMetricChange): cloudwatch.Metric;
}
