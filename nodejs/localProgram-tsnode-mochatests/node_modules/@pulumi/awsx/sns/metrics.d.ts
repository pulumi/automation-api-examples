import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface SnsMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional topic to filter down to.
         */
        topic?: aws.sns.Topic;
        /**
         * Filters on application objects, which represent an app and device registered with one of
         * the supported push notification services, such as APNS and FCM.
         */
        application?: string;
        /**
         * Filters on the destination country or region of an SMS message. The country or region is
         * represented by its ISO 3166-1 alpha-2 code.
         */
        country?: string;
        /**
         * Filters on platform objects for the push notification services, such as APNS and FCM.
         */
        platform?: string;
        /**
         * Filters on the message type of SMS message.
         */
        smsType?: "promotional" | "transactional";
    }
    /**
     * The number of messages published to your Amazon SNS topics.
     *
     * Units: Count
     *
     * Valid Statistics: Sum
     */
    function numberOfMessagesPublished(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages successfully delivered from your Amazon SNS topics to subscribing
     * endpoints.
     *
     * For a delivery attempt to succeed, the endpoint's subscription must accept the message. A
     * subscription accepts a message if a.) it lacks a filter policy or b.) its filter policy
     * includes attributes that match those assigned to the message. If the subscription rejects the
     * message, the delivery attempt isn't counted for this metric.
     *
     * Units: Count
     *
     * Valid Statistics: Sum
     */
    function numberOfNotificationsDelivered(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages that Amazon SNS failed to deliver.
     *
     * For Amazon SQS, email, SMS, or mobile push endpoints, the metric increments by 1 when Amazon
     * SNS stops attempting message deliveries. For HTTP or HTTPS endpoints, the metric includes
     * every failed delivery attempt, including retries that follow the initial attempt. For all
     * other endpoints, the count increases by 1 when the message fails to deliver (regardless of
     * the number of attempts).
     *
     * This metric does not include messages that were rejected by subscription filter policies.
     *
     * Units: Count
     *
     * Valid Statistics: Sum, Average
     */
    function numberOfNotificationsFailed(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages that were rejected by subscription filter policies because the
     * messages have no attributes.
     *
     * Units: Count
     *
     * Valid Statistics: Sum, Average
     */
    function numberOfNotificationsFilteredOut_NoMessageAttributes(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The number of messages that were rejected by subscription filter policies because the
     * messages' attributes are invalid – for example, because the attribute JSON is incorrectly
     * formatted.
     *
     * Units: Count
     *
     * Valid Statistics: Sum, Average
     */
    function numberOfNotificationsFilteredOut_InvalidAttributes(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The number of database connections in use.
     *
     * Units: Bytes
     *
     * Valid Statistics: Minimum, Maximum, Average and Count
     */
    function publishSize(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The charges you have accrued since the start of the current calendar month for sending SMS
     * messages.
     *
     * You can set an alarm for this metric to know when your month-to-date charges are close to the
     * monthly SMS spend limit for your account. When Amazon SNS determines that sending an SMS
     * message would incur a cost that exceeds this limit, it stops publishing SMS messages within
     * minutes.
     *
     * Valid Statistics: Maximum
     */
    function smsMonthToDateSpentUSD(change?: SnsMetricChange): cloudwatch.Metric;
    /**
     * The rate of successful SMS message deliveries.
     *
     * Units: Count
     *
     * Valid Statistics: Sum, Average, Data Samples
     */
    function smsSuccessRate(change?: SnsMetricChange): cloudwatch.Metric;
}
