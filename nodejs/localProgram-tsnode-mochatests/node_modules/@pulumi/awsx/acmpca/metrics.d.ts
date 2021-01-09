import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    /**
     * A certificate revocation list (CRL) was generated. This metric applies only to a private CA.
     */
    function crlGenerated(change?: cloudwatch.MetricChange): cloudwatch.Metric;
    /**
     * The S3 bucket specified for the CRL is not correctly configured. Check the bucket policy. This
     * metric applies only to a private CA.
     */
    function misconfiguredCRLBucket(change?: cloudwatch.MetricChange): cloudwatch.Metric;
    /**
     * The time at which the certificate was issued. This metric applies only to the
     * [IssueCertificate](https://docs.aws.amazon.com/acm-pca/latest/APIReference/API_IssueCertificate.html)
     * operation.
     */
    function time(change?: cloudwatch.MetricChange): cloudwatch.Metric;
    /**
     * Specifies whether a certificate was successfully issued. This metric applies only to the
     * IssueCertificate operation.
     */
    function success(change?: cloudwatch.MetricChange): cloudwatch.Metric;
    /**
     * Indicates that an operation failed. This metric applies only to the IssueCertificate operation.
     */
    function failure(change?: cloudwatch.MetricChange): cloudwatch.Metric;
}
