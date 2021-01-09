import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
import { Cluster } from "./cluster";
import { Service } from "./service";
export declare namespace metrics {
    type EcsMetricName = "CPUReservation" | "CPUUtilization" | "MemoryReservation" | "MemoryUtilization" | "GPUReservation";
    interface EcsMetricChange extends cloudwatch.MetricChange {
        /**
         * This dimension filters the data that you request for all resources in a specified cluster.
         * All Amazon ECS metrics can be filtered by this.
         */
        cluster?: aws.ecs.Cluster | Cluster;
        /**
         * This dimension filters the data that you request for all resources in a specified service
         * within a specified cluster.  If this is an [awsx.ecs.Service] then [cluster] is not required.
         * If this is an [aws.ecs.Service] then [cluster] is required.
         */
        service?: aws.ecs.Service | Service;
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
    function cpuReservation(change?: EcsMetricChange): cloudwatch.Metric;
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
    function cpuUtilization(change?: EcsMetricChange): cloudwatch.Metric;
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
    function memoryReservation(change?: EcsMetricChange): cloudwatch.Metric;
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
    function memoryUtilization(change?: EcsMetricChange): cloudwatch.Metric;
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
    function gpuReservation(change?: EcsMetricChange): cloudwatch.Metric;
}
