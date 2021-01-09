import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface EbsMetricChange extends cloudwatch.MetricChange {
        /**
         * The only dimension that Amazon EBS sends to CloudWatch is the volume ID. This means that
         * all available statistics are filtered by volume ID.
         */
        volume?: aws.ebs.Volume;
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
    function volumeReadBytes(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeWriteBytes(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeReadOps(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeWriteOps(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeTotalReadTime(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeTotalWriteTime(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeIdleTime(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeQueueLength(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeThroughputPercentage(change?: EbsMetricChange): cloudwatch.Metric;
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
    function volumeConsumedReadWriteOps(change?: EbsMetricChange): cloudwatch.Metric;
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
    function burstBalance(change?: EbsMetricChange): cloudwatch.Metric;
}
