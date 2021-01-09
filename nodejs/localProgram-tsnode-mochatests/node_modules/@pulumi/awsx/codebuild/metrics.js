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
     * Creates an AWS/CodeBuild metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html for list of all
     * metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * You can use Amazon CloudWatch to watch your builds, report when something is wrong, and take
     *  automatic actions when appropriate. You can monitor your builds at two levels:
     *
     *  * At the project level: These metrics are for all builds in the specified project only. To see
     *    metrics for a project, specify the ProjectName for the dimension in CloudWatch.
     *
     *  * At the AWS account level: These metrics are for all builds in one account. To see metrics at
     *    the AWS account level, do not enter a dimension in CloudWatch.
     *
     * CloudWatch metrics show the behavior of your builds over time. For example, you can monitor:
     *
     * * How many builds were attempted in a build project or an AWS account over time.
     * * How many builds were successful in a build project or an AWS account over time.
     * * How many builds failed in a build project or an AWS account over time.
     * * How much time CodeBuild spent executing builds in a build project or an AWS account over time.
     *
     * Metrics displayed in the CodeBuild console are always from the past three days. You can use the
     * CloudWatch console to view CodeBuild metrics over different durations.
     *
     * "ProjectName" is the only AWS CodeBuild metrics dimension. If it is specified, then the metrics
     * are for that project. If it is not specified, then the metrics are for the current AWS account.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.project !== undefined) {
            dimensions.ProjectName = change.project.name;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/CodeBuild", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * Measures the duration of the build's BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function buildDuration(change) {
        return metric("BuildDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.buildDuration = buildDuration;
    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function builds(change) {
        return metric("Builds", Object.assign({ statistic: "Sum", unit: "Count" }, change));
    }
    metrics.builds = builds;
    /**
     * Measures the duration of the build's DOWNLOAD_SOURCE phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function downloadSourceDuration(change) {
        return metric("DownloadSourceDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.downloadSourceDuration = downloadSourceDuration;
    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function duration(change) {
        return metric("Duration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.duration = duration;
    /**
     * Measures the number of builds that failed because of client error or because of a timeout.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function failedBuilds(change) {
        return metric("FailedBuilds", Object.assign({ statistic: "Sum", unit: "Count" }, change));
    }
    metrics.failedBuilds = failedBuilds;
    /**
     * Measures the duration of the build's FINALIZING phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function finalizingDuration(change) {
        return metric("FinalizingDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.finalizingDuration = finalizingDuration;
    /**
     * Measures the duration of the build's INSTALL phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function installDuration(change) {
        return metric("InstallDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.installDuration = installDuration;
    /**
     * Measures the duration of the build's POST_BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function postBuildDuration(change) {
        return metric("PostBuildDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.postBuildDuration = postBuildDuration;
    /**
     * Measures the duration of the build's PRE_BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function preBuildDuration(change) {
        return metric("PreBuildDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.preBuildDuration = preBuildDuration;
    /**
     * Measures the duration of the build's PROVISIONING phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function provisioningDuration(change) {
        return metric("ProvisioningDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.provisioningDuration = provisioningDuration;
    /**
     * Measures the duration of the build's QUEUED phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function queuedDuration(change) {
        return metric("QueuedDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.queuedDuration = queuedDuration;
    /**
     * Measures the duration of the build's SUBMITTED phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function submittedDuration(change) {
        return metric("SubmittedDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.submittedDuration = submittedDuration;
    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function succeededBuilds(change) {
        return metric("SucceededBuilds", Object.assign({ statistic: "Sum", unit: "Count" }, change));
    }
    metrics.succeededBuilds = succeededBuilds;
    /**
     * Measures the duration of the build's UPLOAD_ARTIFACTS phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function uploadArtifactsDuration(change) {
        return metric("UploadArtifactsDuration", Object.assign({ statistic: "Average", unit: "Seconds" }, change));
    }
    metrics.uploadArtifactsDuration = uploadArtifactsDuration;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map