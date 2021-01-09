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
     * Creates an AWS/SQS metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-monitoring-using-cloudwatch.html
     * for list of all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * Amazon SQS and Amazon CloudWatch are integrated so you can use CloudWatch to view and analyze
     * metrics for your Amazon SQS queues. You can view and analyze your queues' metrics from the
     * Amazon SQS console, the CloudWatch console, using the AWS CLI, or using the CloudWatch API.
     * You can also set CloudWatch alarms for Amazon SQS metrics.
     *
     * CloudWatch metrics for your Amazon SQS queues are automatically collected and pushed to
     * CloudWatch every five minutes. These metrics are gathered on all queues that meet the
     * CloudWatch guidelines for being active. CloudWatch considers a queue to be active for up to
     * six hours if it contains any messages or if any action accesses it.
     *
     * The only dimension that Amazon SQS sends to CloudWatch is "QueueName"
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.queue !== undefined) {
            dimensions.QueueName = change.queue.name;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/SQS", name: metricName }, change)).withDimensions(dimensions);
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
    function approximateAgeOfOldestMessage(change) {
        return metric("ApproximateAgeOfOldestMessage", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.approximateAgeOfOldestMessage = approximateAgeOfOldestMessage;
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
    function approximateNumberOfMessagesDelayed(change) {
        return metric("ApproximateNumberOfMessagesDelayed", Object.assign({ unit: "Count" }, change));
    }
    metrics.approximateNumberOfMessagesDelayed = approximateNumberOfMessagesDelayed;
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
    function approximateNumberOfMessagesNotVisible(change) {
        return metric("ApproximateNumberOfMessagesNotVisible", Object.assign({ unit: "Count" }, change));
    }
    metrics.approximateNumberOfMessagesNotVisible = approximateNumberOfMessagesNotVisible;
    /**
     * The number of messages available for retrieval from the queue.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    function approximateNumberOfMessagesVisible(change) {
        return metric("ApproximateNumberOfMessagesVisible", Object.assign({ unit: "Count" }, change));
    }
    metrics.approximateNumberOfMessagesVisible = approximateNumberOfMessagesVisible;
    /**
     * The number of ReceiveMessage API calls that did not return a message.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    function numberOfEmptyReceives(change) {
        return metric("NumberOfEmptyReceives", Object.assign({ unit: "Count" }, change));
    }
    metrics.numberOfEmptyReceives = numberOfEmptyReceives;
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
    function numberOfMessagesDeleted(change) {
        return metric("NumberOfMessagesDeleted", Object.assign({ unit: "Count" }, change));
    }
    metrics.numberOfMessagesDeleted = numberOfMessagesDeleted;
    /**
     * The number of messages returned by calls to the ReceiveMessage action.
     */
    function numberOfMessagesReceived(change) {
        return metric("NumberOfMessagesReceived", Object.assign({ unit: "Count" }, change));
    }
    metrics.numberOfMessagesReceived = numberOfMessagesReceived;
    /**
     * The number of messages added to a queue.
     *
     * Units: Count
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    function numberOfMessagesSent(change) {
        return metric("NumberOfMessagesSent", Object.assign({ unit: "Count" }, change));
    }
    metrics.numberOfMessagesSent = numberOfMessagesSent;
    /**
     * The size of messages added to a queue.
     *
     * Units: Bytes
     *
     * Valid Statistics: Average, Minimum, Maximum, Sum, Data Samples (displays as Sample Count in
     * the Amazon SQS console)
     */
    function sentMessageSize(change) {
        return metric("SentMessageSize", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.sentMessageSize = sentMessageSize;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map