import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface CodebuildMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional Project this metric should be filtered down to.
         */
        project?: aws.codebuild.Project;
    }
    /**
     * Measures the duration of the build's BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function buildDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function builds(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's DOWNLOAD_SOURCE phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function downloadSourceDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function duration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the number of builds that failed because of client error or because of a timeout.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function failedBuilds(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's FINALIZING phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function finalizingDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's INSTALL phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function installDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's POST_BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function postBuildDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's PRE_BUILD phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function preBuildDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's PROVISIONING phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function provisioningDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's QUEUED phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function queuedDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's SUBMITTED phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function submittedDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     * Valid CloudWatch statistics: Sum
     */
    function succeededBuilds(change?: CodebuildMetricChange): cloudwatch.Metric;
    /**
     * Measures the duration of the build's UPLOAD_ARTIFACTS phase.
     *
     * Units:Seconds
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     */
    function uploadArtifactsDuration(change?: CodebuildMetricChange): cloudwatch.Metric;
}
