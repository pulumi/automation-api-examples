import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface SqsMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Queue] to filter events down to.
         */
        queue?: aws.sqs.Queue;
    }
    /**
     * The approximate age of the oldest non-deleted message in the queue.
     *
     * Note: For dead-letter queues, the value of ApproximateAgeOfOldestMessage is the longest time
     * that a message has been in the queue.
     *
     * Units: Seconds
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function approximateAgeOfOldestMessage(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages in the queue that are delayed and not available for reading
     * immediately. This can happen when the queue is configured as a delay queue or when a message
     * has been sent with a delay parameter.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function approximateNumberOfMessagesDelayed(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages that are in flight. Messages are considered to be in flight if they
     * have been sent to a client but have not yet been deleted or have not yet reached the end of
     * their visibility window.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function approximateNumberOfMessagesNotVisible(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages available for retrieval from the queue.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function approximateNumberOfMessagesVisible(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of ReceiveMessage API calls that did not return a message.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function numberOfEmptyReceives(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages deleted from the queue.
     *
     * Amazon SQS emits the NumberOfMessagesDeleted metric for every successful deletion operation
     * that uses a valid receipt handle, including duplicate deletions. The following scenarios
     * might cause the value of the NumberOfMessagesDeleted metric to be higher than expected:
     *
     * * Calling the DeleteMessage action on different receipt handles that belong to the same
     *   message: If the message is not processed before the visibility timeout expires, the message
     *   becomes available to other consumers that can process it and delete it again, increasing
     *   the value of the NumberOfMessagesDeleted metric.
     *
     * * Calling the DeleteMessage action on the same receipt handle: If the message is processed
     *   and deleted but you call the DeleteMessage action again using the same receipt handle, a
     *   success status is returned, increasing the value of the NumberOfMessagesDeleted metric.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function numberOfMessagesDeleted(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages returned by calls to the ReceiveMessage action.
     */
    export function numberOfMessagesReceived(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages added to a queue.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function numberOfMessagesSent(change?: SqsMetricChange): cloudwatch.Metric;
    /**
     * The size of messages added to a queue.
     *
     * Units: Bytes
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    export function sentMessageSize(change?: SqsMetricChange): cloudwatch.Metric;
    export {};
}
