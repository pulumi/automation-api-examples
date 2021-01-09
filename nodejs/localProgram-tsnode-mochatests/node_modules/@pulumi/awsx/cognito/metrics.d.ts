import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    interface CognitoMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [UserPool] this metric should be filtered down to.
         */
        userPool?: aws.cognito.UserPool;
    }
    /**
     * Requests where Amazon Cognito detected compromised credentials.
     */
    function compromisedCredentialsRisk(change?: CognitoMetricChange): cloudwatch.Metric;
    /**
     * Requests where Amazon Cognito detected account take-over risk.
     */
    function accountTakeOverRisk(change?: CognitoMetricChange): cloudwatch.Metric;
    /**
     * Requests that Amazon Cognito blocked because of the configuration provided by the developer.
     */
    function overrideBlock(change?: CognitoMetricChange): cloudwatch.Metric;
    /**
     * Requests that Amazon Cognito marked as risky.
     */
    function risk(change?: CognitoMetricChange): cloudwatch.Metric;
    /**
     * Requests where Amazon Cognito did not identify any risk.
     */
    function noRisk(change?: CognitoMetricChange): cloudwatch.Metric;
}
