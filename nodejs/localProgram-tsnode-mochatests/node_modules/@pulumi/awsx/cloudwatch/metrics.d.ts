import * as aws from "@pulumi/aws";
import { Metric, MetricChange } from "./metric";
export declare namespace metrics {
    namespace events {
        interface CloudWatchMetricChange extends MetricChange {
            /**
             * Filters down events to those from the specified [EventRule].
             */
            eventRule?: aws.cloudwatch.EventRule;
        }
        /**
         * Measures the number of times a rule’s target is not invoked in response to an event. This
         * includes invocations that would result in triggering the same rule again, causing an
         * infinite loop.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function deadLetterInvocations(change?: CloudWatchMetricChange): Metric;
        /**
         * Measures the number of times a target is invoked for a rule in response to an event. This
         * includes successful and failed invocations, but does not include throttled or retried attempts
         * until they fail permanently. It does not include DeadLetterInvocations.
         *
         * Note: CloudWatch Events only sends this metric to CloudWatch if it has a non-zero value.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function invocations(change?: CloudWatchMetricChange): Metric;
        /**
         * Measures the number of invocations that failed permanently. This does not include invocations
         * that are retried, or that succeeded after a retry attempt. It also does not count failed
         * invocations that are counted in DeadLetterInvocations.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function failedInvocations(change?: CloudWatchMetricChange): Metric;
        /**
         * Measures the number of triggered rules that matched with any event.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function triggeredRules(change?: CloudWatchMetricChange): Metric;
        /**
         * Measures the number of events that matched with any rule.
         *
         * Valid Dimensions: None
         * Units: Count
         */
        function matchedEvents(change?: CloudWatchMetricChange): Metric;
        /**
         * Measures the number of triggered rules that are being throttled.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function throttledRules(change?: CloudWatchMetricChange): Metric;
    }
    namespace logs {
        type CloudWatchLogMetricName = "IncomingBytes" | "IncomingLogEvents" | "ForwardedBytes" | "ForwardedLogEvents" | "DeliveryErrors" | "DeliveryThrottling";
        interface CloudWatchMetricChange extends MetricChange {
            /**
             * Filters down events to those from the specified [LogGroup].
             */
            logGroup?: aws.cloudwatch.LogGroup;
            /**
             * The subscription destination for the CloudWatch Logs data, which can be AWS Lambda,
             * Amazon Kinesis Data Streams, or Amazon Kinesis Data Firehose.
             */
            destinationType?: string;
            /**
             * The name of the subscription filter that is forwarding data from the log group to the
             * destination. The subscription filter name is automatically converted by CloudWatch to
             * ASCII and any unsupported characters get replaced with a question mark (?).
             */
            filterName?: string;
        }
        /**
         * The volume of log events in uncompressed bytes uploaded to CloudWatch Logs. When used
         * with the LogGroupName dimension, this is the volume of log events in uncompressed bytes
         * uploaded to the log group.
         *
         * Valid Dimensions: LogGroupName
         * Valid Statistic: Sum
         * Units: Bytes
         */
        function incomingBytes(change?: CloudWatchMetricChange): Metric;
        /**
         * The number of log events uploaded to CloudWatch Logs. When used with the LogGroupName dimension,
         * this is the number of log events uploaded to the log group.
         *
         * Valid Dimensions: LogGroupName
         * Valid Statistic: Sum
         * Units: None
         */
        function incomingLogEvents(change?: CloudWatchMetricChange): Metric;
        /**
         * The volume of log events in compressed bytes forwarded to the subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: Bytes
         */
        function forwardedBytes(change?: CloudWatchMetricChange): Metric;
        /**
         * The number of log events forwarded to the subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function forwardedLogEvents(change?: CloudWatchMetricChange): Metric;
        /**
         * The number of log events for which CloudWatch Logs received an error when forwarding data to the
         * subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function deliveryErrors(change?: CloudWatchMetricChange): Metric;
        /**
         * The number of log events for which CloudWatch Logs was throttled when forwarding data to the
         * subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function deliveryThrottling(change?: CloudWatchMetricChange): Metric;
    }
}
