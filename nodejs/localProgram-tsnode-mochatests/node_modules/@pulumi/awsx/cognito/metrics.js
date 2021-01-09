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
     * Creates an AWS/Cognito metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-viewing-advanced-security-metrics.html
     * for list of all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * Amazon Cognito publishes metrics for advanced security features to your account in Amazon
     * CloudWatch. The advanced security metrics are grouped together by risk level and also by request
     * level.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.userPool !== undefined) {
            dimensions.UserPoolId = change.userPool.id;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/Cognito", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * Requests where Amazon Cognito detected compromised credentials.
     */
    function compromisedCredentialsRisk(change) {
        return metric("CompromisedCredentialsRisk", change);
    }
    metrics.compromisedCredentialsRisk = compromisedCredentialsRisk;
    /**
     * Requests where Amazon Cognito detected account take-over risk.
     */
    function accountTakeOverRisk(change) {
        return metric("AccountTakeOverRisk", change);
    }
    metrics.accountTakeOverRisk = accountTakeOverRisk;
    /**
     * Requests that Amazon Cognito blocked because of the configuration provided by the developer.
     */
    function overrideBlock(change) {
        return metric("OverrideBlock", change);
    }
    metrics.overrideBlock = overrideBlock;
    /**
     * Requests that Amazon Cognito marked as risky.
     */
    function risk(change) {
        return metric("Risk", change);
    }
    metrics.risk = risk;
    /**
     * Requests where Amazon Cognito did not identify any risk.
     */
    function noRisk(change) {
        return metric("NoRisk", change);
    }
    metrics.noRisk = noRisk;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map