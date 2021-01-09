import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface Ec2MetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Instance] this metric should be filtered down to.
         */
        instance?: aws.ec2.Instance;
        /**
         * This dimension filters the data you request for all instances running this Amazon EC2
         * Amazon Machine Image (AMI). Available for instances with Detailed Monitoring enabled.
         */
        imageId?: string;
        /**
         * This dimension filters the data you request for all instances running with this specified
         * instance type. This helps you categorize your data by the type of instance running. For
         * example, you might compare data from an m1.small instance and an m1.large instance to
         * determine which has the better business value for your application. Available for
         * instances with Detailed Monitoring enabled.
         */
        instanceType?: aws.ec2.InstanceType;
    }
    /**
     * The number of CPU credits spent by the instance for CPU utilization. One CPU credit equals one
     * vCPU running at 100% utilization for one minute or an equivalent combination of vCPUs,
     * utilization, and time (for example, one vCPU running at 50% utilization for two minutes or two
     * vCPUs running at 25% utilization for two minutes).
     *
     * CPU credit metrics are available at a five-minute frequency only. If you specify a period greater
     * than five minutes, use the Sum statistic instead of the Average statistic.
     */
    function cpuCreditUsage(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of earned CPU credits that an instance has accrued since it was launched or started.
     * For T2 Standard, the CPUCreditBalance also includes the number of launch credits that have been
     * accrued.
     *
     * Credits are accrued in the credit balance after they are earned, and removed from the credit
     * balance when they are spent. The credit balance has a maximum limit, determined by the instance
     * size. After the limit is reached, any new credits that are earned are discarded. For T2 Standard,
     * launch credits do not count towards the limit.
     *
     * The credits in the CPUCreditBalance are available for the instance to spend to burst beyond its
     * baseline CPU utilization.
     *
     * When an instance is running, credits in the CPUCreditBalance do not expire. When a T3 instance
     * stops, the CPUCreditBalance value persists for seven days. Thereafter, all accrued credits are
     * lost. When a T2 instance stops, the CPUCreditBalance value does not persist, and all accrued
     * credits are lost.
     *
     * CPU credit metrics are available at a five-minute frequency only.
     */
    function cpuCreditBalance(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of surplus credits that have been spent by an unlimited instance when its
     * CPUCreditBalance value is zero.
     *
     * The CPUSurplusCreditBalance value is paid down by earned CPU credits. If the number of surplus
     * credits exceeds the maximum number of credits that the instance can earn in a 24-hour period, the
     * spent surplus credits above the maximum incur an additional charge.
     */
    function cpuSurplusCreditBalance(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of spent surplus credits that are not paid down by earned CPU credits, and which thus
     * incur an additional charge.
     *
     * Spent surplus credits are charged when any of the following occurs:
     *
     *  * The spent surplus credits exceed the maximum number of credits that the instance can earn in a
     *    24-hour period. Spent surplus credits above the maximum are charged at the end of the hour.
     *  * The instance is stopped or terminated.
     *  * The instance is switched from unlimited to standard.
     */
    function cpuSurplusCreditsCharged(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The percentage of allocated EC2 compute units that are currently in use on the instance. This
     * metric identifies the processing power required to run an application upon a selected
     * instance.
     *
     * Depending on the instance type, tools in your operating system can show a lower percentage
     * than CloudWatch when the instance is not allocated a full processor core.
     *
     * Units: Percent
     */
    function cpuUtilization(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Completed read operations from all instance store volumes available to the instance in a
     * specified period of time.
     *
     * To calculate the average I/O operations per second (IOPS) for the period, divide the total
     * operations in the period by the number of seconds in that period.
     *
     * If there are no instance store volumes, either the value is 0 or the metric is not reported.
     *
     * Units: Count
     */
    function diskReadOps(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Completed write operations to all instance store volumes available to the instance in a
     * specified period of time.
     *
     * To calculate the average I/O operations per second (IOPS) for the period, divide the total
     * operations in the period by the number of seconds in that period.
     *
     * If there are no instance store volumes, either the value is 0 or the metric is not reported.
     *
     * Units: Count
     */
    function diskWriteOps(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Bytes read from all instance store volumes available to the instance.
     *
     * This metric is used to determine the volume of the data the application reads from the hard
     * disk of the instance. This can be used to determine the speed of the application.
     *
     * The number reported is the number of bytes received during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Bytes/second. If you have
     * detailed (one-minute) monitoring, divide it by 60.
     *
     * If there are no instance store volumes, either the value is 0 or the metric is not reported.
     *
     * Units: Bytes
     */
    function diskReadBytes(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Bytes written to all instance store volumes available to the instance.
     *
     * This metric is used to determine the volume of the data the application writes onto the hard
     * disk of the instance. This can be used to determine the speed of the application.
     *
     * The number reported is the number of bytes received during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Bytes/second. If you have
     * detailed (one-minute) monitoring, divide it by 60.
     *
     * If there are no instance store volumes, either the value is 0 or the metric is not reported.
     *
     * Units: Bytes
     */
    function diskWriteBytes(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of bytes received on all network interfaces by the instance. This metric
     * identifies the volume of incoming network traffic to a single instance.
     *
     * The number reported is the number of bytes received during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Bytes/second. If you have
     * detailed (one-minute) monitoring, divide it by 60.
     *
     * Units: Bytes
     */
    function networkIn(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of bytes sent out on all network interfaces by the instance. This metric
     * identifies the volume of outgoing network traffic from a single instance.
     *
     * The number reported is the number of bytes sent during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Bytes/second. If you have
     * detailed (one-minute) monitoring, divide it by 60.
     *
     * Units: Bytes
     */
    function networkOut(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of packets received on all network interfaces by the instance. This metric
     * identifies the volume of incoming traffic in terms of the number of packets on a single
     * instance. This metric is available for basic monitoring only.
     *
     * Units: Count
     *
     * Statistics: Minimum, Maximum, Average
     */
    function networkPacketsIn(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * The number of packets sent out on all network interfaces by the instance. This metric
     * identifies the volume of outgoing traffic in terms of the number of packets on a single
     * instance. This metric is available for basic monitoring only.
     *
     * Units: Count
     *
     * Statistics: Minimum, Maximum, Average
     */
    function networkPacketsOut(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Reports whether the instance has passed both the instance status check and the system status
     * check in the last minute.
     *
     * This metric can be either 0 (passed) or 1 (failed).
     *
     * By default, this metric is available at a 1-minute frequency at no charge.
     *
     * Units: Count
     */
    function statusCheckFailed(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Reports whether the instance has passed the instance status check in the last minute.
     *
     * This metric can be either 0 (passed) or 1 (failed).
     *
     * By default, this metric is available at a 1-minute frequency at no charge.
     *
     * Units: Count
     */
    function statusCheckFailed_Instance(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Reports whether the instance has passed the system status check in the last minute.
     *
     * This metric can be either 0 (passed) or 1 (failed).
     *
     * By default, this metric is available at a 1-minute frequency at no charge.
     *
     * Units: Count
     */
    function statusCheckFailed_System(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Completed read operations from all Amazon EBS volumes attached to the instance in a specified
     * period of time.
     *
     * To calculate the average read I/O operations per second (Read IOPS) for the period, divide
     * the total operations in the period by the number of seconds in that period. If you are using
     * basic (five-minute) monitoring, you can divide this number by 300 to calculate the Read IOPS.
     * If you have detailed (one-minute) monitoring, divide it by 60.
     *
     * Unit: Count
     */
    function ebsReadOps(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Completed write operations to all EBS volumes attached to the instance in a specified period
     * of time.
     *
     * To calculate the average write I/O operations per second (Write IOPS) for the period, divide
     * the total operations in the period by the number of seconds in that period. If you are using
     * basic (five-minute) monitoring, you can divide this number by 300 to calculate the Write
     * IOPS. If you have detailed (one-minute) monitoring, divide it by 60.
     *
     * Unit: Count
     */
    function ebsWriteOps(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Bytes read from all EBS volumes attached to the instance in a specified period of time.
     *
     * The number reported is the number of bytes read during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Read Bytes/second. If you
     * have detailed (one-minute) monitoring, divide it by 60.
     *
     * Unit: Bytes
     */
    function ebsReadBytes(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Bytes written to all EBS volumes attached to the instance in a specified period of time.
     *
     * The number reported is the number of bytes written during the period. If you are using basic
     * (five-minute) monitoring, you can divide this number by 300 to find Write Bytes/second. If
     * you have detailed (one-minute) monitoring, divide it by 60.
     *
     * Unit: Bytes
     */
    function ebsWriteBytes(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Available only for the smaller instance sizes. Provides information about the percentage of
     * I/O credits remaining in the burst bucket. This metric is available for basic monitoring
     * only.
     *
     * Unit: Percent
     */
    function ebsIOBalance(change?: Ec2MetricChange): cloudwatch.Metric;
    /**
     * Available only for the smaller instance sizes. Provides information about the percentage of
     * throughput credits remaining in the burst bucket. This metric is available for basic
     * monitoring only.
     *
     * Unit: Percent
     */
    function ebsByteBalance(change?: Ec2MetricChange): cloudwatch.Metric;
}
