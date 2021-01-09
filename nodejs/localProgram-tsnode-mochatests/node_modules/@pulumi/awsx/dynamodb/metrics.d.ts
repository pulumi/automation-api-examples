import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface DynamodbMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Table] this metric should be filtered down to.
         */
        table?: aws.dynamodb.Table;
        /**
         * This dimension limits the data to a global secondary index on a table. If you specify
         * this, you must also specify [Table].
         */
        globalSecondaryIndexName?: string;
        /**
         * This dimension limits the data to one of the specified following DynamoDB operations.
         */
        operation?: "PutItem" | "DeleteItem" | "UpdateItem" | "GetItem" | "BatchGetItem" | "Scan" | "Query" | "BatchWriteItem" | "GetRecords";
        /**
         * This dimension limits the data to a particular AWS region. It is used with metrics
         * originating from replica tables within a DynamoDB global table.
         */
        receivingRegion?: aws.Region;
        /**
         * This dimension limits the data to a specific stream label. It is used with metrics
         * originating from Amazon DynamoDB Streams 'GetRecords' operations.
         */
        streamLabel?: string;
    }
    /**
     * The number of failed attempts to perform conditional writes. The PutItem, UpdateItem, and
     * DeleteItem operations let you provide a logical condition that must evaluate to true before
     * the operation can proceed. If this condition evaluates to false,
     * ConditionalCheckFailedRequests is incremented by one.
     *
     * Note: A failed conditional write will result in an HTTP 400 error (Bad Request). These events
     * are reflected in the ConditionalCheckFailedRequests metric, but not in the UserErrors metric.
     *
     * Units: Count
     * Dimensions: TableName
     * Valid Statistics: Minimum, Maximum, Average, SampleCount, Sum
     */
    function conditionalCheckFailedRequests(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of read capacity units consumed over the specified time period, so you can track
     * how much of your provisioned throughput is used. You can retrieve the total consumed read
     * capacity for a table and all of its global secondary indexes, or for a particular global
     * secondary index. For more information, see Provisioned Throughput in Amazon DynamoDB.
     *
     * Note: Use the Sum statistic to calculate the consumed throughput. For example, get the Sum
     * value over a span of one minute, and divide it by the number of seconds in a minute (60) to
     * calculate the average ConsumedReadCapacityUnits per second (recognizing that this average
     * will not highlight any large but brief spikes in read activity that occurred during that
     * minute). You can compare the calculated value to the provisioned throughput value you provide
     * DynamoDB.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum – Minimum number of read capacity units consumed by any individual request to the
     *   table or index.
     * * Maximum – Maximum number of read capacity units consumed by any individual request to the
     *   table or index.
     * * Average – Average per-request read capacity consumed.
     * * Sum – Total read capacity units consumed. This is the most useful statistic for the
     *   ConsumedReadCapacityUnits metric.
     * * SampleCount – Number of requests to DynamoDB that consumed read capacity.
     */
    function consumedReadCapacityUnits(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of write capacity units consumed over the specified time period, so you can track
     * how much of your provisioned throughput is used. You can retrieve the total consumed write
     * capacity for a table and all of its global secondary indexes, or for a particular global
     * secondary index. For more information, see Provisioned Throughput in Amazon DynamoDB.
     *
     * Note: Use the Sum statistic to calculate the consumed throughput. For example, get the Sum
     * value over a span of one minute, and divide it by the number of seconds in a minute (60) to
     * calculate the average ConsumedWriteCapacityUnits per second (recognizing that this average
     * will not highlight any large but brief spikes in write activity that occurred during that
     * minute). You can compare the calculated value to the provisioned throughput value you provide
     * DynamoDB.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     *
     * * Minimum – Minimum number of write capacity units consumed by any individual request to the
     *   table or index.
     * * Maximum – Maximum number of write capacity units consumed by any individual request to the
     *   table or index.
     * * Average – Average per-request write capacity consumed.
     * * Sum – Total write capacity units consumed. This is the most useful statistic for the
     *   ConsumedWriteCapacityUnits metric.
     * * SampleCount – Number of requests to DynamoDB that consumed write capacity.
     */
    function consumedWriteCapacityUnits(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of write capacity units consumed when adding a new global secondary index to a
     * table. If the write capacity of the index is too low, incoming write activity during the
     * backfill phase might be throttled; this can increase the time it takes to create the index.
     * You should monitor this statistic while the index is being built to determine whether the
     * write capacity of the index is underprovisioned.
     *
     * You can adjust the write capacity of the index using the UpdateTable operation, even while
     * the index is still being built.
     *
     * Note that the ConsumedWriteCapacityUnits metric for the index does not include the write
     * throughput consumed during index creation.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function onlineIndexConsumedWriteCapacity(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The percentage of completion when a new global secondary index is being added to a table.
     * DynamoDB must first allocate resources for the new index, and then backfill attributes from the
     * table into the index. For large tables, this process might take a long time. You should monitor
     * this statistic to view the relative progress as DynamoDB builds the index.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function onlineIndexPercentageProgress(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of write throttle events that occur when adding a new global secondary index to a
     * table. These events indicate that the index creation will take longer to complete, because
     * incoming write activity is exceeding the provisioned write throughput of the index.
     *
     * You can adjust the write capacity of the index using the UpdateTable operation, even while the
     * index is still being built.
     *
     * Note that the WriteThrotttleEvents metric for the index does not include any throttle events that
     * occur during index creation.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function onlineIndexThrottleEvents(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * (This metric is for DynamoDB global tables.) The number of item updates that are written to
     * one replica table, but that have not yet been written to another replica in the global table.
     *
     * Units: Count
     *
     * Dimensions: TableName, ReceivingRegion
     *
     * Valid Statistics:
     * * Average
     * * Sample Count
     * * Sum
     */
    function pendingReplicationCount(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of provisioned read capacity units for a table or a global secondary index. The
     * TableName dimension returns the ProvisionedReadCapacityUnits for the table, but not for any
     * global secondary indexes. To view ProvisionedReadCapacityUnits for a global secondary index,
     * you must specify both TableName and GlobalSecondaryIndex.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum – Lowest setting for provisioned read capacity. If you use UpdateTable to increase
     *   read capacity, this metric shows the lowest value of provisioned ReadCapacityUnits during
     *   this time period.
     * * Maximum – Highest setting for provisioned read capacity. If you use UpdateTable to decrease
     *   read capacity, this metric shows the highest value of provisioned ReadCapacityUnits during
     *   this time period.
     * * Average – Average provisioned read capacity. The ProvisionedReadCapacityUnits metric is
     *   published at five-minute intervals. Therefore, if you rapidly adjust the provisioned read
     *   capacity units, this statistic might not reflect the true average.
     */
    function provisionedReadCapacityUnits(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of provisioned write capacity units for a table or a global secondary index
     *
     * The TableName dimension returns the ProvisionedWriteCapacityUnits for the table, but not for
     * any global secondary indexes. To view ProvisionedWriteCapacityUnits for a global secondary
     * index, you must specify both TableName and GlobalSecondaryIndex.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Minimum – Lowest setting for provisioned write capacity. If you use UpdateTable to increase
     *   write capacity, this metric shows the lowest value of provisioned WriteCapacityUnits during
     *   this time period.
     * * Maximum – Highest setting for provisioned write capacity. If you use UpdateTable to
     *   decrease write capacity, this metric shows the highest value of provisioned
     *   WriteCapacityUnits during this time period.
     * * Average – Average provisioned write capacity. The ProvisionedWriteCapacityUnits metric is
     *   published at five-minute intervals. Therefore, if you rapidly adjust the provisioned write
     *   capacity units, this statistic might not reflect the true average.
     */
    function provisionedWriteCapacityUnits(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Requests to DynamoDB that exceed the provisioned read capacity units for a table or a global
     * secondary index.
     *
     * A single request can result in multiple events. For example, a BatchGetItem that reads 10
     * items is processed as ten GetItem events. For each event, ReadThrottleEvents is incremented
     * by one if that event is throttled. The ThrottledRequests metric for the entire BatchGetItem
     * is not incremented unless all ten of the GetItem events are throttled.
     *
     * The TableName dimension returns the ReadThrottleEvents for the table, but not for any global
     * secondary indexes. To view ReadThrottleEvents for a global secondary index, you must specify
     * both TableName and GlobalSecondaryIndex.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * SampleCount
     * * Sum
     */
    function readThrottleEvents(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * (This metric is for DynamoDB global tables.) The elapsed time between an updated item
     * appearing in the DynamoDB stream for one replica table, and that item appearing in another
     * replica in the global table.
     *
     * Units: Milliseconds
     *
     * Dimensions: TableName, ReceivingRegion
     *
     * Valid Statistics:
     * * Average
     * * Minimum
     * * Maximum
     */
    function replicationLatency(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes returned by GetRecords operations (Amazon DynamoDB Streams) during the
     * specified time period.
     *
     * Units: Bytes
     *
     * Dimensions: Operation, StreamLabel, TableName
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function returnedBytes(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of items returned by Query or Scan operations during the specified time period.
     *
     * Note that the number of items returned is not necessarily the same as the number of items
     * that were evaluated. For example, suppose you requested a Scan on a table that had 100 items,
     * but specified a FilterExpression that narrowed the results so that only 15 items were
     * returned. In this case, the response from Scan would contain a ScanCount of 100 and a Count
     * of 15 returned items.
     *
     * Units: Count
     *
     * Dimensions: TableName, Operation
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function returnedItemCount(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of stream records returned by GetRecords operations (Amazon DynamoDB Streams)
     * during the specified time period.
     *
     * Units: Count
     *
     * Dimensions: Operation, StreamLabel, TableName
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     * * Sum
     */
    function returnedRecordsCount(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Successful requests to DynamoDB or Amazon DynamoDB Streams during the specified time period.
     * SuccessfulRequestLatency can provide two different kinds of information:
     *
     *  The elapsed time for successful requests (Minimum, Maximum, Sum, or Average). The number of
     *  successful requests (SampleCount).
     *
     * SuccessfulRequestLatency reflects activity only within DynamoDB or Amazon DynamoDB Streams,
     * and does not take into account network latency or client-side activity.
     *
     * Units: Milliseconds
     *
     * Dimensions: TableName, Operation
     *
     * Valid Statistics:
     * * Minimum
     * * Maximum
     * * Average
     * * SampleCount
     */
    function successfulRequestLatency(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Requests to DynamoDB or Amazon DynamoDB Streams that generate an HTTP 500 status code during
     * the specified time period. An HTTP 500 usually indicates an internal service error.
     *
     * Units: Count
     *
     * Dimensions: All dimensions
     *
     * Valid Statistics:
     * * Sum
     * * SampleCount
     */
    function systemErrors(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * The number of items deleted by Time To Live (TTL) during the specified time period. This
     * metric helps you monitor the rate of TTL deletions on your table.
     *
     * Units: Count
     *
     * Dimensions: TableName
     *
     * Valid Statistics:
     * * Sum
     */
    function timeToLiveDeletedItemCount(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Requests to DynamoDB that exceed the provisioned throughput limits on a resource (such as a
     * table or an index).
     *
     * ThrottledRequests is incremented by one if any event within a request exceeds a provisioned
     * throughput limit. For example, if you update an item in a table with global secondary
     * indexes, there are multiple events—a write to the table, and a write to each index. If one or
     * more of these events are throttled, then ThrottledRequests is incremented by one.
     *
     * Note: In a batch request (BatchGetItem or BatchWriteItem), ThrottledRequests is only
     * incremented if every request in the batch is throttled.
     *
     * If any individual request within the batch is throttled, one of the following metrics is
     * incremented:
     *
     *  * ReadThrottleEvents – For a throttled GetItem event within BatchGetItem.
     *  * WriteThrottleEvents – For a throttled PutItem or DeleteItem event within BatchWriteItem.
     *
     * To gain insight into which event is throttling a request, compare ThrottledRequests with the
     * ReadThrottleEvents and WriteThrottleEvents for the table and its indexes.
     *
     * Note: A throttled request will result in an HTTP 400 status code. All such events are
     * reflected in the ThrottledRequests metric, but not in the UserErrors metric.
     *
     * Units: Count
     *
     * Dimensions: TableName, Operation
     *
     * Valid Statistics:
     * * Sum
     * * SampleCount
     */
    function throttledRequests(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Requests to DynamoDB or Amazon DynamoDB Streams that generate an HTTP 400 status code during
     * the specified time period. An HTTP 400 usually indicates a client-side error such as an
     * invalid combination of parameters, attempting to update a nonexistent table, or an incorrect
     * request signature.
     *
     * All such events are reflected in the UserErrors metric, except for the following:
     *
     *  * ProvisionedThroughputExceededException – See the ThrottledRequests metric in this section.
     *  * ConditionalCheckFailedException – See the ConditionalCheckFailedRequests metric in this
     *    section.
     *
     * UserErrors represents the aggregate of HTTP 400 errors for DynamoDB or Amazon DynamoDB
     * Streams requests for the current region and the current AWS account.
     *
     * Units: Count
     *
     * Valid Statistics:
     * * Sum
     * * SampleCount
     */
    function userErrors(change?: DynamodbMetricChange): cloudwatch.Metric;
    /**
     * Requests to DynamoDB that exceed the provisioned write capacity units for a table or a global
     * secondary index.
     *
     * A single request can result in multiple events. For example, a PutItem request on a table
     * with three global secondary indexes would result in four events—the table write, and each of
     * the three index writes. For each event, the WriteThrottleEvents metric is incremented by one
     * if that event is throttled. For single PutItem requests, if any of the events are throttled,
     * ThrottledRequests is also incremented by one. For BatchWriteItem, the ThrottledRequests
     * metric for the entire BatchWriteItem is not incremented unless all of the individual PutItem
     * or DeleteItem events are throttled.
     *
     * The TableName dimension returns the WriteThrottleEvents for the table, but not for any global
     * secondary indexes. To view WriteThrottleEvents for a global secondary index, you must specify
     * both TableName and GlobalSecondaryIndex.
     *
     * Units: Count
     *
     * Dimensions: TableName, GlobalSecondaryIndexName
     *
     * Valid Statistics:
     * * Sum
     * * SampleCount
     */
    function writeThrottleEvents(change?: DynamodbMetricChange): cloudwatch.Metric;
}
