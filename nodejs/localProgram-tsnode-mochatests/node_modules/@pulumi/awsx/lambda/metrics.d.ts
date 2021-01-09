import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface LambdaMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional Function this metric should be filtered down to.
         */
        function?: aws.lambda.Function;
        /**
         * Filters the metric data by Lambda function resource, such as function version or alias.
         */
        resource?: string;
        /**
         * Filters the metric data by Lambda function versions. This only applies to alias
         * invocations.
         */
        executedVersion?: string;
    }
    /**
     * Measures the number of times a function is invoked in response to an event or invocation API
     * call. This replaces the deprecated RequestCount metric. This includes successful and failed
     * invocations, but does not include throttled attempts. This equals the billed requests for the
     * function. Note that AWS Lambda only sends these metrics to CloudWatch if they have a nonzero
     * value.
     *
     * Units: Count
     */
    function invocations(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Measures the number of invocations that failed due to errors in the function (response code
     * 4XX). This replaces the deprecated ErrorCount metric. Failed invocations may trigger a retry
     * attempt that succeeds. This includes:
     *
     * * Handled exceptions (for example, context.fail(error))
     * * Unhandled exceptions causing the code to exit
     * * Out of memory exceptions
     * * Timeouts
     * * Permissions errors
     *
     * This does not include invocations that fail due to invocation rates exceeding default
     * concurrent limits (error code 429) or failures due to internal service errors (error code
     * 500).
     *
     * Units: Count
     */
    function errors(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Incremented when Lambda is unable to write the failed event payload to your configured Dead
     * Letter Queues. This could be due to the following:
     *
     * * Permissions errors
     * * Throttles from downstream services
     * * Misconfigured resources
     * * Timeouts
     *
     * Units: Count
     */
    function deadLetterErrors(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Measures the elapsed wall clock time from when the function code starts executing as a result
     * of an invocation to when it stops executing. The maximum data point value possible is the
     * function timeout configuration. The billed duration will be rounded up to the nearest 100
     * millisecond. Note that AWS Lambda only sends these metrics to CloudWatch if they have a
     * nonzero value.
     *
     * Units: Count
     */
    function duration(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Measures the number of Lambda function invocation attempts that were throttled due to
     * invocation rates exceeding the customer’s concurrent limits (error code 429). Failed
     * invocations may trigger a retry attempt that succeeds.
     *
     * Units: Count
     */
    function throttles(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Emitted for stream-based invocations only (functions triggered by an Amazon DynamoDB stream
     * or Kinesis stream). Measures the age of the last record for each batch of records processed.
     * Age is the difference between the time Lambda received the batch, and the time the last
     * record in the batch was written to the stream.
     *
     * Units: Milliseconds
     */
    function iteratorAge(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Emitted as an aggregate metric for all functions in the account, and for functions that have
     * a custom concurrency limit specified. Not applicable for versions or aliases. Measures the
     * sum of concurrent executions for a given function at a given point in time. Must be viewed as
     * an average metric if aggregated across a time period.
     *
     * Units: Count
     */
    function concurrentExecutions(change?: LambdaMetricChange): cloudwatch.Metric;
    /**
     * Emitted as an aggregate metric for all functions in the account only. Not applicable for
     * functions, versions, or aliases. Represents the sum of the concurrency of the functions that
     * do not have a custom concurrency limit specified. Must be viewed as an average metric if
     * aggregated across a time period.
     *
     * Units: Count
     */
    function unreservedConcurrentExecutions(change?: LambdaMetricChange): cloudwatch.Metric;
}
