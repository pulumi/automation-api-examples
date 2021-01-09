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
const cloudwatch = require("../cloudwatch");
var metrics;
(function (metrics) {
    /**
     * Creates an AWS/AutoScaling metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html for list
     * of all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * Amazon CloudWatch enables you to retrieve statistics as an ordered set of time-series data, known
     * as metrics. You can use these metrics to verify that your system is performing as expected.
     *
     * Amazon EC2 sends metrics to CloudWatch that describe your Auto Scaling instances. These metrics
     * are available for any EC2 instance, not just those in an Auto Scaling group. For more
     * information, see Instance Metrics in the Amazon EC2 User Guide for Linux Instances.
     *
     * Auto Scaling groups can send metrics to CloudWatch that describe the group itself. You must
     * enable these metrics.
     *
     * To filter the metrics for your Auto Scaling group by group name, use the "AutoScalingGroupName"
     * dimension.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.group !== undefined) {
            dimensions.AutoScalingGroupName = change.group.name;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/AutoScaling", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * The minimum size of the Auto Scaling group.
     */
    function groupMinSize(change) {
        return metric("GroupMinSize", change);
    }
    metrics.groupMinSize = groupMinSize;
    /**
     * The maximum size of the Auto Scaling group.
     */
    function groupMaxSize(change) {
        return metric("GroupMaxSize", change);
    }
    metrics.groupMaxSize = groupMaxSize;
    /**
     * The number of instances that the Auto Scaling group attempts to maintain.
     */
    function groupDesiredCapacity(change) {
        return metric("GroupDesiredCapacity", change);
    }
    metrics.groupDesiredCapacity = groupDesiredCapacity;
    /**
     * The number of instances that are running as part of the Auto Scaling group. This metric does not
     * include instances that are pending or terminating.
     */
    function groupInServiceInstances(change) {
        return metric("GroupInServiceInstances", change);
    }
    metrics.groupInServiceInstances = groupInServiceInstances;
    /**
     * The number of instances that are pending. A pending instance is not yet in service. This metric
     * does not include instances that are in service or terminating.
     */
    function groupPendingInstances(change) {
        return metric("GroupPendingInstances", change);
    }
    metrics.groupPendingInstances = groupPendingInstances;
    /**
     * The number of instances that are in a Standby state. Instances in this state are still running
     * but are not actively in service.
     */
    function groupStandbyInstances(change) {
        return metric("GroupStandbyInstances", change);
    }
    metrics.groupStandbyInstances = groupStandbyInstances;
    /**
     * The number of instances that are in the process of terminating. This metric does not include
     * instances that are in service or pending.
     */
    function groupTerminatingInstances(change) {
        return metric("GroupTerminatingInstances", change);
    }
    metrics.groupTerminatingInstances = groupTerminatingInstances;
    /**
     * The total number of instances in the Auto Scaling group. This metric identifies the number of
     * instances that are in service, pending, and terminating.
     */
    function groupTotalInstances(change) {
        return metric("GroupTotalInstances", change);
    }
    metrics.groupTotalInstances = groupTotalInstances;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map