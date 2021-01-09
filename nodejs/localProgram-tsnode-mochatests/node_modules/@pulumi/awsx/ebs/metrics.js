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
     * Creates an AWS/EBS metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-volume-status.html for list of all
     * metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * Amazon Web Services (AWS) automatically provides data, such as Amazon CloudWatch metrics and
     * volume status checks, that you can use to monitor your Amazon Elastic Block Store (Amazon EBS)
     * volumes.
     *
     * CloudWatch metrics are statistical data that you can use to view, analyze, and set alarms on the
     * operational behavior of your volumes.
     *
     * The following table describes the types of monitoring data available for your Amazon EBS volumes.
     *
     * * Basic: Data is available automatically in 5-minute periods at no charge. This includes data for
     *   the root device volumes for EBS-backed instances.
     *
     * * Detailed: Provisioned IOPS SSD (io1) volumes automatically send one-minute metrics to
     *   CloudWatch.
     *
     * When you get data from CloudWatch, you can include a Period request parameter to specify the
     * granularity of the returned data. This is different than the period that we use when we collect
     * the data (5-minute periods). We recommend that you specify a period in your request that is equal
     * to or larger than the collection period to ensure that the returned data is valid.
     *
     * You can get the data using either the CloudWatch API or the Amazon EC2 console. The console takes
     * the raw data from the CloudWatch API and displays a series of graphs based on the data. Depending
     * on your needs, you might prefer to use either the data from the API or the graphs in the console.
     * Amazon EBS Metrics
     *
     * Amazon Elastic Block Store (Amazon EBS) sends data points to CloudWatch for several metrics.
     * Amazon EBS General Purpose SSD (gp2), Throughput Optimized HDD (st1) , Cold HDD (sc1), and
     * Magnetic (standard) volumes automatically send five-minute metrics to CloudWatch. Provisioned
     * IOPS SSD (io1) volumes automatically send one-minute metrics to CloudWatch. Data is only reported
     * to CloudWatch when the volume is attached to an instance.
     *
     * Some of these metrics have differences on Nitro-based instances. For a list of instance types
     * based on the Nitro system, see
     * [Nitro-based-Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#ec2-nitro-instances).
     *
     * The only dimension that Amazon EBS sends to CloudWatch is the volume ID. This means that all
     * available statistics are filtered by volume ID.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.volume !== undefined) {
            dimensions.VolumeId = change.volume.id;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/EBS", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * Provides information on the read operations in a specified period of time. The Sum statistic
     * reports the total number of bytes transferred during the period. The Average statistic
     * reports the average size of each read operation during the period, except on volumes attached
     * to a Nitro-based instance, where the average represents the average over the specified
     * period. The SampleCount statistic reports the total number of read operations during the
     * period, except on volumes attached to a Nitro-based instance, where the sample count
     * represents the number of data points used in the statistical calculation. For Xen instances,
     * data is reported only when there is read activity on the volume.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Bytes
     */
    function volumeReadBytes(change) {
        return metric("VolumeReadBytes", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.volumeReadBytes = volumeReadBytes;
    /**
     * Provides information on the write operations in a specified period of time. The Sum statistic
     * reports the total number of bytes transferred during the period. The Average statistic
     * reports the average size of each write operation during the period, except on volumes
     * attached to a Nitro-based instance, where the average represents the average over the
     * specified period. The SampleCount statistic reports the total number of write operations
     * during the period, except on volumes attached to a Nitro-based instance, where the sample
     * count represents the number of data points used in the statistical calculation. For Xen
     * instances, data is reported only when there is write activity on the volume.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Bytes
     */
    function volumeWriteBytes(change) {
        return metric("VolumeWriteBytes", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.volumeWriteBytes = volumeWriteBytes;
    /**
     * The total number of read operations in a specified period of time.
     *
     * To calculate the average read operations per second (read IOPS) for the period, divide the
     * total read operations in the period by the number of seconds in that period.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Count
     */
    function volumeReadOps(change) {
        return metric("VolumeReadOps", Object.assign({ unit: "Count" }, change));
    }
    metrics.volumeReadOps = volumeReadOps;
    /**
     * The total number of write operations in a specified period of time.
     *
     * To calculate the average write operations per second (write IOPS) for the period, divide the
     * total write operations in the period by the number of seconds in that period.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Count
     */
    function volumeWriteOps(change) {
        return metric("VolumeWriteOps", Object.assign({ unit: "Count" }, change));
    }
    metrics.volumeWriteOps = volumeWriteOps;
    /**
     * The total number of seconds spent by all read operations that completed in a specified period
     * of time. If multiple requests are submitted at the same time, this total could be greater
     * than the length of the period. For example, for a period of 5 minutes (300 seconds): if 700
     * operations completed during that period, and each operation took 1 second, the value would be
     * 700 seconds. For Xen instances, data is reported only when there is read activity on the
     * volume.
     *
     * The Average statistic on this metric is not relevant for volumes attached to Nitro-based
     * instances.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Seconds
     */
    function volumeTotalReadTime(change) {
        return metric("VolumeTotalReadTime", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.volumeTotalReadTime = volumeTotalReadTime;
    /**
     * The total number of seconds spent by all write operations that completed in a specified
     * period of time. If multiple requests are submitted at the same time, this total could be
     * greater than the length of the period. For example, for a period of 5 minutes (300 seconds):
     * if 700 operations completed during that period, and each operation took 1 second, the value
     * would be 700 seconds. For Xen instances, data is reported only when there is write activity
     * on the volume.
     *
     * The Average statistic on this metric is not relevant for volumes attached to Nitro-based
     * instances.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Seconds
     */
    function volumeTotalWriteTime(change) {
        return metric("VolumeTotalWriteTime", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.volumeTotalWriteTime = volumeTotalWriteTime;
    /**
     * The total number of seconds in a specified period of time when no read or write operations
     * were submitted.
     *
     * The Average statistic on this metric is not relevant for volumes attached to Nitro-based
     * instances.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Seconds
     */
    function volumeIdleTime(change) {
        return metric("VolumeIdleTime", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.volumeIdleTime = volumeIdleTime;
    /**
     * The number of read and write operation requests waiting to be completed in a specified period
     * of time.
     *
     * The Sum statistic on this metric is not relevant for volumes attached to Nitro-based
     * instances.
     *
     * The Minimum and Maximum statistics on this metric are supported only by volumes attached to
     * Nitro-based instances.
     *
     * Units: Count
     */
    function volumeQueueLength(change) {
        return metric("VolumeQueueLength", Object.assign({ unit: "Count" }, change));
    }
    metrics.volumeQueueLength = volumeQueueLength;
    /**
     * Used with Provisioned IOPS SSD volumes only. The percentage of I/O operations per second
     * (IOPS) delivered of the total IOPS provisioned for an Amazon EBS volume. Provisioned IOPS SSD
     * volumes deliver within 10 percent of the provisioned IOPS performance 99.9 percent of the
     * time over a given year.
     *
     * During a write, if there are no other pending I/O requests in a minute, the metric value will
     * be 100 percent. Also, a volume's I/O performance may become degraded temporarily due to an
     * action you have taken (for example, creating a snapshot of a volume during peak usage,
     * running the volume on a non-EBS-optimized instance, or accessing data on the volume for the
     * first time).
     *
     * Units: Percent
     */
    function volumeThroughputPercentage(change) {
        return metric("VolumeThroughputPercentage", Object.assign({ unit: "Percent" }, change));
    }
    metrics.volumeThroughputPercentage = volumeThroughputPercentage;
    /**
     * Used with Provisioned IOPS SSD volumes only. The total amount of read and write operations
     * (normalized to 256K capacity units) consumed in a specified period of time.
     *
     * I/O operations that are smaller than 256K each count as 1 consumed IOPS. I/O operations that
     * are larger than 256K are counted in 256K capacity units. For example, a 1024K I/O would count
     * as 4 consumed IOPS.
     *
     * Units: Count
     */
    function volumeConsumedReadWriteOps(change) {
        return metric("VolumeConsumedReadWriteOps", Object.assign({ unit: "Count" }, change));
    }
    metrics.volumeConsumedReadWriteOps = volumeConsumedReadWriteOps;
    /**
     * Used with General Purpose SSD (gp2), Throughput Optimized HDD (st1), and Cold HDD (sc1)
     * volumes only. Provides information about the percentage of I/O credits (for gp2) or
     * throughput credits (for st1 and sc1) remaining in the burst bucket. Data is reported to
     * CloudWatch only when the volume is active. If the volume is not attached, no data is
     * reported.
     *
     * The Sum statistic on this metric is not relevant for volumes attached to Nitro-based
     * instances.
     *
     * For a volume 1 TiB or larger, baseline performance is higher than maximum burst performance,
     * so I/O credits are never spent. If the volume is attached to a Nitro-based instance, the
     * burst balance is not reported. For a non-Nitro-based instance, the reported burst balance is
     * 100%.
     *
     * Units: Percent
     */
    function burstBalance(change) {
        return metric("BurstBalance", Object.assign({ unit: "Percent" }, change));
    }
    metrics.burstBalance = burstBalance;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map