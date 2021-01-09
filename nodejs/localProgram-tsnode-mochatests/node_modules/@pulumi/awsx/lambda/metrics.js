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
     * Creates an AWS/Lambda metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/lambda/latest/dg/monitoring-functions-metrics.html for list of
     * all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * You can use the following dimensions to refine the metrics returned for your Lambda
     * functions:
     *
     * 1. "FunctionName". Filters the metric data by Lambda function.
     * 2. "Resource". Filters the metric data by Lambda function resource, such as function version
     *    or alias.
     * 3. "ExecutedVersion". Filters the metric data by Lambda function versions. This only applies
     *    to alias invocations.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.function !== undefined) {
            dimensions.FunctionName = change.function.name;
        }
        if (change.resource !== undefined) {
            dimensions.Resource = change.resource;
        }
        if (change.executedVersion !== undefined) {
            dimensions.ExecutedVersion = change.executedVersion;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/Lambda", name: metricName }, change)).withDimensions(dimensions);
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
    function invocations(change) {
        return metric("Invocations", Object.assign({ unit: "Count" }, change));
    }
    metrics.invocations = invocations;
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
    function errors(change) {
        return metric("Errors", Object.assign({ unit: "Count" }, change));
    }
    metrics.errors = errors;
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
    function deadLetterErrors(change) {
        return metric("DeadLetterErrors", Object.assign({ unit: "Count" }, change));
    }
    metrics.deadLetterErrors = deadLetterErrors;
    /**
     * Measures the elapsed wall clock time from when the function code starts executing as a result
     * of an invocation to when it stops executing. The maximum data point value possible is the
     * function timeout configuration. The billed duration will be rounded up to the nearest 100
     * millisecond. Note that AWS Lambda only sends these metrics to CloudWatch if they have a
     * nonzero value.
     *
     * Units: Count
     */
    function duration(change) {
        return metric("Duration", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.duration = duration;
    /**
     * Measures the number of Lambda function invocation attempts that were throttled due to
     * invocation rates exceeding the customer’s concurrent limits (error code 429). Failed
     * invocations may trigger a retry attempt that succeeds.
     *
     * Units: Count
     */
    function throttles(change) {
        return metric("Throttles", Object.assign({ unit: "Count" }, change));
    }
    metrics.throttles = throttles;
    /**
     * Emitted for stream-based invocations only (functions triggered by an Amazon DynamoDB stream
     * or Kinesis stream). Measures the age of the last record for each batch of records processed.
     * Age is the difference between the time Lambda received the batch, and the time the last
     * record in the batch was written to the stream.
     *
     * Units: Milliseconds
     */
    function iteratorAge(change) {
        return metric("IteratorAge", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.iteratorAge = iteratorAge;
    /**
     * Emitted as an aggregate metric for all functions in the account, and for functions that have
     * a custom concurrency limit specified. Not applicable for versions or aliases. Measures the
     * sum of concurrent executions for a given function at a given point in time. Must be viewed as
     * an average metric if aggregated across a time period.
     *
     * Units: Count
     */
    function concurrentExecutions(change) {
        return metric("ConcurrentExecutions", Object.assign({ unit: "Count" }, change));
    }
    metrics.concurrentExecutions = concurrentExecutions;
    /**
     * Emitted as an aggregate metric for all functions in the account only. Not applicable for
     * functions, versions, or aliases. Represents the sum of the concurrency of the functions that
     * do not have a custom concurrency limit specified. Must be viewed as an average metric if
     * aggregated across a time period.
     *
     * Units: Count
     */
    function unreservedConcurrentExecutions(change) {
        return metric("UnreservedConcurrentExecutions", Object.assign({ unit: "Count" }, change));
    }
    metrics.unreservedConcurrentExecutions = unreservedConcurrentExecutions;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map