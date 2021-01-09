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
const cluster_1 = require("./cluster");
const service_1 = require("./service");
var metrics;
(function (metrics) {
    /**
     * Creates an AWS/ECS metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html for list of
     * all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * You can monitor your Amazon ECS resources using Amazon CloudWatch, which collects and processes
     * raw data from Amazon ECS into readable, near real-time metrics. These statistics are recorded for
     * a period of two weeks so that you can access historical information and gain a better perspective
     * on how your clusters or services are performing. Amazon ECS metric data is automatically sent to
     * CloudWatch in 1-minute periods. For more information about CloudWatch, see the
     * [Amazon-CloudWatch-User-Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/).
     *
     * Amazon ECS metrics use the AWS/ECS namespace and provide metrics for the following dimensions.
     *
     * 1. "ClusterName": This dimension filters the data that you request for all resources in a
     *    specified cluster. All Amazon ECS metrics are filtered by ClusterName.
     * 2. "ServiceName": This dimension filters the data that you request for all resources in a
     *    specified service within a specified cluster.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.cluster !== undefined) {
            if (change.cluster instanceof cluster_1.Cluster) {
                dimensions.ClusterName = change.cluster.cluster.name;
            }
            else {
                dimensions.ClusterName = change.cluster.name;
            }
        }
        if (change.service !== undefined) {
            if (change.service instanceof service_1.Service) {
                dimensions.ServiceName = change.service.service.name;
                dimensions.ClusterName = change.service.cluster.cluster.name;
            }
            else {
                if (!change.cluster) {
                    throw new Error("[change.cluster] must be provided if [change.service] is an [aws.ecs.Service]");
                }
                dimensions.ServiceName = change.service.name;
            }
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/ECS", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * The percentage of CPU units that are reserved by running tasks in the cluster.
     *
     * Cluster CPU reservation (this metric can only be filtered by ClusterName) is measured as the
     * total CPU units that are reserved by Amazon ECS tasks on the cluster, divided by the total
     * CPU units that were registered for all of the container instances in the cluster. This metric
     * is only used for tasks using the EC2 launch type.
     *
     * Valid dimensions: ClusterName.
     *
     * Valid statistics: Average, Minimum, Maximum, Sum, Sample Count. The most useful statistic is
     * Average.
     *
     * Unit: Percent.
     */
    function cpuReservation(change) {
        return metric("CPUReservation", Object.assign({ unit: "Percent" }, change));
    }
    metrics.cpuReservation = cpuReservation;
    /**
     * The percentage of CPU units that are used in the cluster or service.
     *
     * Cluster CPU utilization (metrics that are filtered by ClusterName without ServiceName) is
     * measured as the total CPU units in use by Amazon ECS tasks on the cluster, divided by the
     * total CPU units that were registered for all of the container instances in the cluster.
     * Cluster CPU utilization metrics are only used for tasks using the EC2 launch type.
     *
     * Service CPU utilization (metrics that are filtered by ClusterName and ServiceName) is
     * measured as the total CPU units in use by the tasks that belong to the service, divided by
     * the total number of CPU units that are reserved for the tasks that belong to the service.
     * Service CPU utilization metrics are used for tasks using both the Fargate and the EC2 launch
     * type.
     *
     * Valid dimensions: ClusterName, ServiceName.
     *
     * Valid statistics: Average, Minimum, Maximum, Sum, Sample Count. The most useful statistic is
     * Average.
     *
     * Unit: Percent.
     */
    function cpuUtilization(change) {
        return metric("CPUUtilization", Object.assign({ unit: "Percent" }, change));
    }
    metrics.cpuUtilization = cpuUtilization;
    /**
     * The percentage of memory that is reserved by running tasks in the cluster.
     *
     * Cluster memory reservation (this metric can only be filtered by ClusterName) is measured as
     * the total memory that is reserved by Amazon ECS tasks on the cluster, divided by the total
     * amount of memory that was registered for all of the container instances in the cluster. This
     * metric is only used for tasks using the EC2 launch type.
     *
     * Valid dimensions: ClusterName.
     *
     * Valid statistics: Average, Minimum, Maximum, Sum, Sample Count. The most useful statistic is
     * Average.
     *
     * Unit: Percent.
     */
    function memoryReservation(change) {
        return metric("MemoryReservation", Object.assign({ unit: "Percent" }, change));
    }
    metrics.memoryReservation = memoryReservation;
    /**
     * The percentage of memory that is used in the cluster or service.
     *
     * Cluster memory utilization (metrics that are filtered by ClusterName without ServiceName) is
     * measured as the total memory in use by Amazon ECS tasks on the cluster, divided by the total
     * amount of memory that was registered for all of the container instances in the cluster.
     * Cluster memory utilization metrics are only used for tasks using the EC2 launch type.
     *
     * Service memory utilization (metrics that are filtered by ClusterName and ServiceName) is
     * measured as the total memory in use by the tasks that belong to the service, divided by the
     * total memory that is reserved for the tasks that belong to the service. Service memory
     * utilization metrics are used for tasks using both the Fargate and EC2 launch types.
     *
     * Valid dimensions: ClusterName, ServiceName.
     *
     * Valid statistics: Average, Minimum, Maximum, Sum, Sample Count. The most useful statistic is
     * Average.
     *
     * Unit: Percent.
     */
    function memoryUtilization(change) {
        return metric("MemoryUtilization", Object.assign({ unit: "Percent" }, change));
    }
    metrics.memoryUtilization = memoryUtilization;
    /**
     * The percentage of total available GPUs that are reserved by running tasks in the cluster.
     *
     * Cluster GPU reservation is measured as the number of GPUs reserved by Amazon ECS tasks on the
     * cluster, divided by the total number of GPUs that was available on all of the GPU-enabled
     * container instances in the cluster.
     *
     * Valid dimensions: ClusterName.
     *
     * Valid statistics: Average, Minimum, Maximum, Sum, Sample Count. The most useful statistic is
     * Average.
     *
     * Unit: Percent.
     */
    function gpuReservation(change) {
        return metric("GPUReservation", Object.assign({ unit: "Percent" }, change));
    }
    metrics.gpuReservation = gpuReservation;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map