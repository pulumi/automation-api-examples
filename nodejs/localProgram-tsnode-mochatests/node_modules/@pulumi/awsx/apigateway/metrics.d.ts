import * as aws from "@pulumi/aws";
import { API } from ".";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface ApigatewayMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [RestApi] this metric should be filtered down to.  Only one of [RestApi] or
         * [api] can be provided.
         */
        restApi?: aws.apigateway.RestApi;
        /**
         * Optional [API] this metric should be filtered down to.  Only one of [RestApi] or [api]
         * can be provided.
         */
        api?: API;
        /**
         * Filters API Gateway metrics for an API method of the specified API, stage, resource, and
         * method.
         *
         * API Gateway will not send such metrics unless you have explicitly enabled detailed
         * CloudWatch metrics. You can do this in the console by selecting Enable CloudWatch Metrics
         * under a stage Settings tab. Alternatively, you can call the stage:update action of the
         * API Gateway REST API to update the metricsEnabled property to true.
         *
         * Enabling such metrics will incur additional charges to your account. For pricing
         * information, see Amazon CloudWatch Pricing.
         */
        method?: string;
        /**
         * Filters API Gateway metrics for an API method of the specified API, stage, resource, and
         * method.
         *
         * API Gateway will not send such metrics unless you have explicitly enabled detailed
         * CloudWatch metrics. You can do this in the console by selecting Enable CloudWatch Metrics
         * under a stage Settings tab. Alternatively, you can call the stage:update action of the
         * API Gateway REST API to update the metricsEnabled property to true.
         *
         * Enabling such metrics will incur additional charges to your account. For pricing
         * information, see Amazon CloudWatch Pricing.
         */
        resource?: string;
        /**
         * Filters API Gateway metrics for an API stage of the specified API and stage.  Either
         * [restApi] or [api] must be provided with this.
         */
        stage?: string;
    }
    /**
     * The number of client-side errors captured in a specified period.
     *
     * The Sum statistic represents this metric, namely, the total count of the 4XXError errors in the
     * given period. The Average statistic represents the 4XXError error rate, namely, the total count
     * of the 4XXError errors divided by the total number of requests during the period. The denominator
     * corresponds to the Count metric (below).
     *
     * Unit: Count
     */
    function error4XX(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The number of server-side errors captured in a given period.
     *
     * The Sum statistic represents this metric, namely, the total count of the 5XXError errors in the
     * given period. The Average statistic represents the 5XXError error rate, namely, the total count
     * of the 5XXError errors divided by the total number of requests during the period. The denominator
     * corresponds to the Count metric (below).
     *
     * Unit: Count
     */
    function error5XX(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The number of requests served from the API cache in a given period.
     *
     * The Sum statistic represents this metric, namely, the total count of the cache hits in the
     * specified period. The Average statistic represents the cache hit rate, namely, the total count of
     * the cache hits divided by the total number of requests during the period. The denominator
     * corresponds to the Count metric (below).
     */
    function cacheHitCount(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The number of requests served from the back end in a given period, when API caching is enabled.
     *
     * The Sum statistic represents this metric, namely, the total count of the cache misses in the
     * specified period. The Average statistic represents the cache miss rate, namely, the total count
     * of the cache hits divided by the total number of requests during the period. The denominator
     * corresponds to the Count metric (below).
     *
     * Unit: Count
     */
    function cacheMissCount(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The total number API requests in a given period.
     *
     * The SampleCount statistic represents this metric.
     *
     * Unit: Count
     */
    function count(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The time between when API Gateway relays a request to the back end and when it receives a
     * response from the back end.
     *
     * Unit: Milliseconds
     */
    function integrationLatency(change?: ApigatewayMetricChange): cloudwatch.Metric;
    /**
     * The time between when API Gateway receives a request from a client and when it returns a response
     * to the client. The latency includes the integration latency and other API Gateway overhead.
     *
     * Unit: Milliseconds
     */
    function latency(change?: ApigatewayMetricChange): cloudwatch.Metric;
}
