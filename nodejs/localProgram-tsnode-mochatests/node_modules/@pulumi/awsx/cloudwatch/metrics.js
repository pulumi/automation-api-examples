"use strict";
// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const metric_1 = require("./metric");
var metrics;
(function (metrics) {
    let events;
    (function (events) {
        /**
         * CloudWatch Events sends metrics to Amazon CloudWatch every minute.
         *
         * Creates an AWS/Events metric with the requested [metricName]. See
         * https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatch-Events-Monitoring-CloudWatch-Metrics.html
         * for list of all metric-names.
         *
         * Note, individual metrics can easily be obtained without supplying the name using the other
         * [metricXXX] functions.
         *
         * All of these metrics use Count as the unit, so Sum and SampleCount are the most useful
         * statistics.
         *
         * CloudWatch Events metrics have one dimension:
         * 1. "RuleName": Filters the available metrics by rule name.
         */
        function metric(metricName, change = {}) {
            const dimensions = {};
            if (change.eventRule !== undefined) {
                dimensions.RuleName = change.eventRule.name;
            }
            return new metric_1.Metric(Object.assign({ namespace: "AWS/Events", name: metricName }, change)).withDimensions(dimensions);
        }
        /**
         * Measures the number of times a rule’s target is not invoked in response to an event. This
         * includes invocations that would result in triggering the same rule again, causing an
         * infinite loop.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function deadLetterInvocations(change) {
            return metric("DeadLetterInvocations", Object.assign({ unit: "Count" }, change));
        }
        events.deadLetterInvocations = deadLetterInvocations;
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
        function invocations(change) {
            return metric("Invocations", Object.assign({ unit: "Count" }, change));
        }
        events.invocations = invocations;
        /**
         * Measures the number of invocations that failed permanently. This does not include invocations
         * that are retried, or that succeeded after a retry attempt. It also does not count failed
         * invocations that are counted in DeadLetterInvocations.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function failedInvocations(change) {
            return metric("FailedInvocations", Object.assign({ unit: "Count" }, change));
        }
        events.failedInvocations = failedInvocations;
        /**
         * Measures the number of triggered rules that matched with any event.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function triggeredRules(change) {
            return metric("TriggeredRules", Object.assign({ unit: "Count" }, change));
        }
        events.triggeredRules = triggeredRules;
        /**
         * Measures the number of events that matched with any rule.
         *
         * Valid Dimensions: None
         * Units: Count
         */
        function matchedEvents(change) {
            return metric("MatchedEvents", Object.assign({ unit: "Count" }, change));
        }
        events.matchedEvents = matchedEvents;
        /**
         * Measures the number of triggered rules that are being throttled.
         *
         * Valid Dimensions: RuleName
         * Units: Count
         */
        function throttledRules(change) {
            return metric("ThrottledRules", Object.assign({ unit: "Count" }, change));
        }
        events.throttledRules = throttledRules;
    })(events = metrics.events || (metrics.events = {}));
    let logs;
    (function (logs) {
        /**
         * CloudWatch Logs sends metrics to Amazon CloudWatch every minute.
         *
         * Creates an AWS/Logs metric with the requested [metricName]. See
         * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html
         * for list of all metric-names.
         *
         * Note, individual metrics can easily be obtained without supplying the name using the other
         * [metricXXX] functions.
         *
         * The dimensions that you can use with CloudWatch Logs metrics are:
         * 1. "LogGroupName": The name of the CloudWatch Logs log group for which to display metrics.
         * 2. "DestinationType": The subscription destination for the CloudWatch Logs data, which can be AWS
         *    Lambda, Amazon Kinesis Data Streams, or Amazon Kinesis Data Firehose.
         * 3. "FilterName": The name of the subscription filter that is forwarding data from the log group
         *    to the destination. The subscription filter name is automatically converted by CloudWatch to
         *    ASCII and any unsupported characters get replaced with a question mark (?).
         */
        function metric(metricName, change = {}) {
            const dimensions = {};
            if (change.logGroup !== undefined) {
                dimensions.LogGroupName = change.logGroup.name;
            }
            if (change.destinationType !== undefined) {
                dimensions.DestinationType = change.destinationType;
            }
            if (change.filterName !== undefined) {
                dimensions.FilterName = change.filterName;
            }
            return new metric_1.Metric(Object.assign({ namespace: "AWS/Logs", name: metricName }, change)).withDimensions(dimensions);
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
        function incomingBytes(change) {
            return metric("IncomingBytes", Object.assign({ statistic: "Sum", unit: "Bytes" }, change));
        }
        logs.incomingBytes = incomingBytes;
        /**
         * The number of log events uploaded to CloudWatch Logs. When used with the LogGroupName dimension,
         * this is the number of log events uploaded to the log group.
         *
         * Valid Dimensions: LogGroupName
         * Valid Statistic: Sum
         * Units: None
         */
        function incomingLogEvents(change) {
            return metric("IncomingLogEvents", Object.assign({ statistic: "Sum", unit: "None" }, change));
        }
        logs.incomingLogEvents = incomingLogEvents;
        /**
         * The volume of log events in compressed bytes forwarded to the subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: Bytes
         */
        function forwardedBytes(change) {
            return metric("ForwardedBytes", Object.assign({ statistic: "Sum", unit: "Bytes" }, change));
        }
        logs.forwardedBytes = forwardedBytes;
        /**
         * The number of log events forwarded to the subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function forwardedLogEvents(change) {
            return metric("ForwardedLogEvents", Object.assign({ statistic: "Sum", unit: "None" }, change));
        }
        logs.forwardedLogEvents = forwardedLogEvents;
        /**
         * The number of log events for which CloudWatch Logs received an error when forwarding data to the
         * subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function deliveryErrors(change) {
            return metric("DeliveryErrors", Object.assign({ statistic: "Sum", unit: "None" }, change));
        }
        logs.deliveryErrors = deliveryErrors;
        /**
         * The number of log events for which CloudWatch Logs was throttled when forwarding data to the
         * subscription destination.
         *
         * Valid Dimensions: LogGroupName, DestinationType, FilterName
         * Valid Statistic: Sum
         * Units: None
         */
        function deliveryThrottling(change) {
            return metric("DeliveryThrottling", Object.assign({ statistic: "Sum", unit: "None" }, change));
        }
        logs.deliveryThrottling = deliveryThrottling;
    })(logs = metrics.logs || (metrics.logs = {}));
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map