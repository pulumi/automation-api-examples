import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface CloudfrontMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Distribution] this metric should be filtered down to.
         */
        distribution?: aws.cloudfront.Distribution;
        /**
         * The region for which you want to display metrics. This value must be Global. The Region
         * dimension is different from the region in which CloudFront metrics are stored, which is
         * US East (N. Virginia).
         */
        region?: string;
    }
    /**
     * The number of requests for all HTTP methods and for both HTTP and HTTPS requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function requests(change?: CloudfrontMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes downloaded by viewers for GET, HEAD, and OPTIONS requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function bytesDownloaded(change?: CloudfrontMetricChange): cloudwatch.Metric;
    /**
     * The number of bytes uploaded to your origin with CloudFront using POST and PUT requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function bytesUploaded(change?: CloudfrontMetricChange): cloudwatch.Metric;
    /**
     * The percentage of all requests for which the HTTP status code is 4xx or 5xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function totalErrorRate(change?: CloudfrontMetricChange): cloudwatch.Metric;
    /**
     * The percentage of all requests for which the HTTP status code is 4xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function errorRate4xx(change?: CloudfrontMetricChange): cloudwatch.Metric;
    /**
     * The percentage of all requests for which the HTTP status code is 5xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function errorRate5xx(change?: CloudfrontMetricChange): cloudwatch.Metric;
}
