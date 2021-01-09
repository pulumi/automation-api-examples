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
     * Creates an AWS/ACMPrivateCA metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/acm-pca/latest/userguide/PcaCloudWatch.html for list of all
     * metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     */
    function metric(metricName, change = {}) {
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/ACMPrivateCA", name: metricName }, change));
    }
    /**
     * A certificate revocation list (CRL) was generated. This metric applies only to a private CA.
     */
    function crlGenerated(change) {
        return metric("CRLGenerated", change);
    }
    metrics.crlGenerated = crlGenerated;
    /**
     * The S3 bucket specified for the CRL is not correctly configured. Check the bucket policy. This
     * metric applies only to a private CA.
     */
    function misconfiguredCRLBucket(change) {
        return metric("MisconfiguredCRLBucket", change);
    }
    metrics.misconfiguredCRLBucket = misconfiguredCRLBucket;
    /**
     * The time at which the certificate was issued. This metric applies only to the
     * [IssueCertificate](https://docs.aws.amazon.com/acm-pca/latest/APIReference/API_IssueCertificate.html)
     * operation.
     */
    function time(change) {
        return metric("Time", change);
    }
    metrics.time = time;
    /**
     * Specifies whether a certificate was successfully issued. This metric applies only to the
     * IssueCertificate operation.
     */
    function success(change) {
        return metric("Success", change);
    }
    metrics.success = success;
    /**
     * Indicates that an operation failed. This metric applies only to the IssueCertificate operation.
     */
    function failure(change) {
        return metric("Failure", change);
    }
    metrics.failure = failure;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map