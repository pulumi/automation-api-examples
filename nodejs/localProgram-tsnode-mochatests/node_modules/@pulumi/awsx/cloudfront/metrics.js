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
     * Creates an AWS/CloudFront metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/monitoring-using-cloudwatch.html
     * for list of all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * CloudFront metrics use the CloudFront namespace and provide metrics for two dimensions:
     *
     * 1. "DistributionId": The CloudFront ID of the distribution for which you want to display metrics.
     * 2. "Region": The region for which you want to display metrics. This value must be Global. The
     *    Region dimension is different from the region in which CloudFront metrics are stored, which is
     *    US East (N. Virginia).
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.distribution !== undefined) {
            dimensions.DistributionId = change.distribution.id;
        }
        if (change.region !== undefined) {
            dimensions.Region = change.region;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/CloudFront", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * The number of requests for all HTTP methods and for both HTTP and HTTPS requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function requests(change) {
        return metric("Requests", Object.assign({ statistic: "Sum", unit: "None" }, change));
    }
    metrics.requests = requests;
    /**
     * The number of bytes downloaded by viewers for GET, HEAD, and OPTIONS requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function bytesDownloaded(change) {
        return metric("BytesDownloaded", Object.assign({ statistic: "Sum", unit: "None" }, change));
    }
    metrics.bytesDownloaded = bytesDownloaded;
    /**
     * The number of bytes uploaded to your origin with CloudFront using POST and PUT requests.
     *
     * Valid Statistics: Sum
     * Units: None
     */
    function bytesUploaded(change) {
        return metric("BytesUploaded", Object.assign({ statistic: "Sum", unit: "None" }, change));
    }
    metrics.bytesUploaded = bytesUploaded;
    /**
     * The percentage of all requests for which the HTTP status code is 4xx or 5xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function totalErrorRate(change) {
        return metric("TotalErrorRate", Object.assign({ statistic: "Average", unit: "Percent" }, change));
    }
    metrics.totalErrorRate = totalErrorRate;
    /**
     * The percentage of all requests for which the HTTP status code is 4xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function errorRate4xx(change) {
        return metric("4xxErrorRate", Object.assign({ statistic: "Average", unit: "Percent" }, change));
    }
    metrics.errorRate4xx = errorRate4xx;
    /**
     * The percentage of all requests for which the HTTP status code is 5xx.
     *
     * Valid Statistics: Average
     * Units: Percent
     */
    function errorRate5xx(change) {
        return metric("5xxErrorRate", Object.assign({ statistic: "Average", unit: "Percent" }, change));
    }
    metrics.errorRate5xx = errorRate5xx;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map