import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface EfsMetricChange extends cloudwatch.MetricChange {
        /**
         * Filters down events to the specified [FileSystem].
         */
        fileSystem?: aws.efs.FileSystem;
    }
    /**
     * The number of burst credits that a file system has.
     *
     * Burst credits allow a file system to burst to throughput levels above a file system’s
     * baseline level for periods of time. For more information, see Throughput scaling in Amazon
     * EFS.
     *
     * The Minimum statistic is the smallest burst credit balance for any minute during the period.
     * The Maximum statistic is the largest burst credit balance for any minute during the period.
     * The Average statistic is the average burst credit balance during the period.
     *
     * Units: Bytes
     *
     * Valid statistics: Minimum, Maximum, Average
     */
    function burstCreditBalance(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The number of client connections to a file system. When using a standard client, there is one
     * connection per mounted Amazon EC2 instance.
     *
     * Note: To calculate the average ClientConnections for periods greater than one minute, divide
     * the Sum statistic by the number of minutes in the period.
     *
     * Units: Count of client connections
     *
     * Valid statistics: Sum
     */
    function clientConnections(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes for each file system read operation.
     *
     * The Sum statistic is the total number of bytes associated with read operations. The Minimum
     * statistic is the size of the smallest read operation during the period. The Maximum statistic
     * is the size of the largest read operation during the period. The Average statistic is the
     * average size of read operations during the period. The SampleCount statistic provides a count
     * of read operations.
     *
     * Units:
     * * Bytes for Minimum, Maximum, Average, and Sum.
     * * Count for SampleCount.
     *
     * Valid statistics: Minimum, Maximum, Average, Sum, SampleCount
     */
    function dataReadIOBytes(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes for each file write operation.
     *
     * The Sum statistic is the total number of bytes associated with write operations. The Minimum
     * statistic is the size of the smallest write operation during the period. The Maximum
     * statistic is the size of the largest write operation during the period. The Average statistic
     * is the average size of write operations during the period. The SampleCount statistic provides
     * a count of write operations.
     *
     * Units:
     * * Bytes for Minimum, Maximum, Average, and Sum.
     * * Count for SampleCount.
     *
     * Valid statistics: Minimum, Maximum, Average, Sum, SampleCount
     */
    function dataWriteIOBytes(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes for each metadata operation.
     *
     * The Sum statistic is the total number of bytes associated with metadata operations. The
     * Minimum statistic is the size of the smallest metadata operation during the period. The
     * Maximum statistic is the size of the largest metadata operation during the period. The
     * Average statistic is the size of the average metadata operation during the period. The
     * SampleCount statistic provides a count of metadata operations.
     *
     * Units:
     * * Bytes for Minimum, Maximum, Average, and Sum.
     * * Count for SampleCount.
     *
     * Valid statistics: Minimum, Maximum, Average, Sum, SampleCount
     */
    function metadataIOBytes(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * Shows how close a file system is to reaching the I/O limit of the General Purpose performance
     * mode. If this metric is at 100% more often than not, consider moving your application to a
     * file system using the Max I/O performance mode.
     *
     * Note: This metric is only submitted for file systems using the General Purpose performance
     * mode.
     *
     * Units: Percent
     */
    function percentIOLimit(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The maximum amount of throughput a file system is allowed. For file systems in the
     * Provisioned Throughput mode, if the amount of storage allows your file system to drive a
     * higher amount of throughput than you provisioned, this metric will reflect the higher
     * throughput instead of the provisioned amount. For file systems in the Bursting Throughput
     * mode, this value is a function of the file system size and BurstCreditBalance. For more
     * information, see Amazon EFS Performance.
     *
     * The Minimum statistic is the smallest throughput permitted for any minute during the period.
     * The Maximum statistic is the highest throughput permitted for any minute during the period.
     * The Average statistic is the average throughput permitted during the period.
     *
     * Units: Bytes per second
     *
     * Valid statistics: Minimum, Maximum, Average
     */
    function permittedThroughput(change?: EfsMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes for each file system operation, including data read, data write, and
     * metadata operations.
     *
     * The Sum statistic is the total number of bytes associated with all file system operations.
     * The Minimum statistic is the size of the smallest operation during the period. The Maximum
     * statistic is the size of the largest operation during the period. The Average statistic is
     * the average size of an operation during the period. The SampleCount statistic provides a
     * count of all operations.
     *
     * Note: To calculate the average operations per second for a period, divide the SampleCount
     * statistic by the number of seconds in the period. To calculate the average throughput (Bytes
     * per second) for a period, divide the Sum statistic by the number of seconds in the period.
     *
     * Units:
     * Bytes for Minimum, Maximum, Average, and Sum statistics.
     * Count for SampleCount.
     *
     * Valid statistics: Minimum, Maximum, Average, Sum, SampleCount
     */
    function totalIOBytes(change?: EfsMetricChange): cloudwatch.Metric;
}
