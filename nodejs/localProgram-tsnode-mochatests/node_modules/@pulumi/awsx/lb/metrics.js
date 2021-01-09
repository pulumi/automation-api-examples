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
const loadBalancer_1 = require("./loadBalancer");
const targetGroup_1 = require("./targetGroup");
var metrics;
(function (metrics) {
    function createDimensions(change = {}) {
        const dimensions = {};
        if (change.loadBalancer !== undefined) {
            if (change.loadBalancer instanceof loadBalancer_1.LoadBalancer) {
                dimensions.LoadBalancer = change.loadBalancer.loadBalancer.arnSuffix;
            }
            else {
                dimensions.LoadBalancer = change.loadBalancer.arnSuffix;
            }
        }
        if (change.targetGroup !== undefined) {
            if (change.targetGroup instanceof targetGroup_1.TargetGroup) {
                dimensions.TargetGroup = change.targetGroup.targetGroup.arnSuffix;
                dimensions.LoadBalancer = change.targetGroup.loadBalancer.loadBalancer.arnSuffix;
            }
            else {
                if (!change.loadBalancer) {
                    throw new Error("[change.loadBalancer] must be provided if [change.targetGroup] is an [aws.lb.TargetGroup]");
                }
                dimensions.TargetGroup = change.targetGroup.arnSuffix;
            }
        }
        if (change.availabilityZone !== undefined) {
            dimensions.AvailabilityZone = change.availabilityZone;
        }
        return dimensions;
    }
    let application;
    (function (application) {
        /**
         * Creates an AWS/ApplicationELB metric with the requested [metricName]. See
         * https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html
         * for list of all metric-names.
         *
         * Elastic Load Balancing publishes data points to Amazon CloudWatch for your load balancers
         * and your targets. CloudWatch enables you to retrieve statistics about those data points
         * as an ordered set of time-series data, known as metrics. Think of a metric as a variable
         * to monitor, and the data points as the values of that variable over time. For example,
         * you can monitor the total number of healthy targets for a load balancer over a specified
         * time period. Each data point has an associated time stamp and an optional unit of
         * measurement.
         *
         * You can use metrics to verify that your system is performing as expected. For example,
         * you can create a CloudWatch alarm to monitor a specified metric and initiate an action
         * (such as sending a notification to an email address) if the metric goes outside what you
         * consider an acceptable range.
         *
         * Elastic Load Balancing reports metrics to CloudWatch only when requests are flowing
         * through the load balancer. If there are requests flowing through the load balancer,
         * Elastic Load Balancing measures and sends its metrics in 60-second intervals. If there
         * are no requests flowing through the load balancer or no data for a metric, the metric is
         * not reported.
         *
         * To filter the metrics for your Application Load Balancer, use the following dimensions.
         * 1. "AvailabilityZone": Filters the metric data by Availability Zone.
         * 2. "LoadBalancer": Filters the metric data by load balancer. Specify the load balancer
         *    using `LoadBalancer.arnSuffix`.
         * 3. "TargetGroup": Filters the metric data by target group. Specify the target group using
         *    `TargetGroup.arnSuffix`.
         */
        function metric(metricName, change = {}) {
            const dimensions = createDimensions(change);
            return new cloudwatch.Metric(Object.assign({ namespace: "AWS/ApplicationELB", name: metricName }, change)).withDimensions(dimensions);
        }
        /**
         * The total number of concurrent TCP connections active from clients to the load balancer
         * and from the load balancer to targets. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions LoadBalancer
         */
        function activeConnectionCount(change) {
            return metric("ActiveConnectionCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.activeConnectionCount = activeConnectionCount;
        /**
         * The number of TLS connections initiated by the client that did not establish a session
         * with the load balancer. Possible causes include a mismatch of ciphers or protocols.
         * Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: AvailabilityZone, LoadBalancer
         */
        function clientTLSNegotiationErrorCount(change) {
            return metric("ClientTLSNegotiationErrorCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.clientTLSNegotiationErrorCount = clientTLSNegotiationErrorCount;
        /**
         * The number of load balancer capacity units (LCU) used by your load balancer. You pay for
         * the number of LCUs that you use per hour. For more information, see Elastic Load
         * Balancing Pricing. Reporting criteria: Always reported
         *
         * Statistics: All
         *
         * Dimensions: LoadBalancer
         */
        function consumedLCUs(change) {
            return metric("ConsumedLCUs", Object.assign({}, change));
        }
        application.consumedLCUs = consumedLCUs;
        /**
         * The number of fixed-response actions that were successful. Reporting criteria: There is a
         * nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function httpFixedResponseCount(change) {
            return metric("HTTP_Fixed_Response_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpFixedResponseCount = httpFixedResponseCount;
        /**
         * The number of redirect actions that were successful. Reporting criteria: There is a
         * nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function httpRedirectCount(change) {
            return metric("HTTP_Redirect_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpRedirectCount = httpRedirectCount;
        /**
         * The number of redirect actions that couldn't be completed because the URL in the response
         * location header is larger than 8K. Reporting criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function httpRedirectUrlLimitExceededCount(change) {
            return metric("HTTP_Redirect_Url_Limit_Exceeded_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpRedirectUrlLimitExceededCount = httpRedirectUrlLimitExceededCount;
        /**
         * The number of HTTP 3XX redirection codes that originate from the load balancer. Reporting
         * criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function httpCodeELB3XXCount(change) {
            return metric("HTTPCode_ELB_3XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB3XXCount = httpCodeELB3XXCount;
        /**
         * The number of HTTP 4XX client error codes that originate from the load balancer. Client
         * errors are generated when requests are malformed or incomplete. These requests have not
         * been received by the target. This count does not include any response codes generated by
         * the targets. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer
         */
        function httpCodeELB4XXCount(change) {
            return metric("HTTPCode_ELB_4XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB4XXCount = httpCodeELB4XXCount;
        /**
         * The number of HTTP 5XX server error codes that originate from the load balancer. This
         * count does not include any response codes generated by the targets. Reporting criteria:
         * There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer
         */
        function httpCodeELB5XXCount(change) {
            return metric("HTTPCode_ELB_5XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB5XXCount = httpCodeELB5XXCount;
        /**
         * The number of HTTP 500 error codes that originate from the load balancer.
         *
         * Reporting criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         */
        function httpCodeELB500Count(change) {
            return metric("HTTPCode_ELB_500_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB500Count = httpCodeELB500Count;
        /**
         * The number of HTTP 502 error codes that originate from the load balancer. Reporting
         * criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         */
        function httpCodeELB502Count(change) {
            return metric("HTTPCode_ELB_502_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB502Count = httpCodeELB502Count;
        /**
         * The number of HTTP 503 error codes that originate from the load balancer. Reporting
         * criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         */
        function httpCodeELB503Count(change) {
            return metric("HTTPCode_ELB_503_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB503Count = httpCodeELB503Count;
        /**
         * The number of HTTP 504 error codes that originate from the load balancer. Reporting
         * criteria: There is a nonzero value
         *
         * Statistics: The only meaningful statistic is Sum.
         */
        function httpCodeELB504Count(change) {
            return metric("HTTPCode_ELB_504_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeELB504Count = httpCodeELB504Count;
        /**
         * The total number of bytes processed by the load balancer over IPv6. Reporting criteria:
         * There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function ipv6ProcessedBytes(change) {
            return metric("IPv6ProcessedBytes", Object.assign({ statistic: "Sum" }, change));
        }
        application.ipv6ProcessedBytes = ipv6ProcessedBytes;
        /**
         * The number of IPv6 requests received by the load balancer. Reporting criteria: There is a
         * nonzero value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function ipv6RequestCount(change) {
            return metric("IPv6RequestCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.ipv6RequestCount = ipv6RequestCount;
        /**
         * The total number of new TCP connections established from clients to the load balancer and
         * from the load balancer to targets. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function newConnectionCount(change) {
            return metric("NewConnectionCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.newConnectionCount = newConnectionCount;
        /**
         * The total number of bytes processed by the load balancer over IPv4 and IPv6. Reporting
         * criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function processedBytes(change) {
            return metric("ProcessedBytes", Object.assign({ statistic: "Sum" }, change));
        }
        application.processedBytes = processedBytes;
        /**
         * The number of connections that were rejected because the load balancer had reached its
         * maximum number of connections. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer
         */
        function rejectedConnectionCount(change) {
            return metric("RejectedConnectionCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.rejectedConnectionCount = rejectedConnectionCount;
        /**
         * The number of requests processed over IPv4 and IPv6. This count includes only the
         * requests with a response generated by a target of the load balancer. Reporting criteria:
         * Always reported
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function requestCount(change) {
            return metric("RequestCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.requestCount = requestCount;
        /**
         * The number of rules processed by the load balancer given a request rate averaged over an
         * hour. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer
         */
        function ruleEvaluations(change) {
            return metric("RuleEvaluations", Object.assign({ statistic: "Sum" }, change));
        }
        application.ruleEvaluations = ruleEvaluations;
        /**
         * The number of targets that are considered healthy. Reporting criteria: Reported if health
         * checks are enabled
         *
         * Statistics: The most useful statistics are Average, Minimum, and Maximum.
         *
         * Dimensions:          TargetGroup, LoadBalancer TargetGroup, AvailabilityZone,
         * LoadBalancer
         */
        function healthyHostCount(change) {
            return metric("HealthyHostCount", Object.assign({}, change));
        }
        application.healthyHostCount = healthyHostCount;
        /**
         * The number of HTTP response codes generated by the targets. This does not include any
         * response codes generated by the load balancer. Reporting criteria: There is a nonzero
         * value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function httpCodeTarget2XXCount(change) {
            return metric("HTTPCode_Target_2XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeTarget2XXCount = httpCodeTarget2XXCount;
        /**
         * The number of HTTP response codes generated by the targets. This does not include any
         * response codes generated by the load balancer. Reporting criteria: There is a nonzero
         * value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function httpCodeTarget3XXCount(change) {
            return metric("HTTPCode_Target_3XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeTarget3XXCount = httpCodeTarget3XXCount;
        /**
         * The number of HTTP response codes generated by the targets. This does not include any
         * response codes generated by the load balancer. Reporting criteria: There is a nonzero
         * value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function httpCodeTarget4XXCount(change) {
            return metric("HTTPCode_Target_4XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeTarget4XXCount = httpCodeTarget4XXCount;
        /**
         * The number of HTTP response codes generated by the targets. This does not include any
         * response codes generated by the load balancer. Reporting criteria: There is a nonzero
         * value
         *
         * Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all
         * return 1.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function httpCodeTarget5XXCount(change) {
            return metric("HTTPCode_Target_5XX_Count", Object.assign({ statistic: "Sum" }, change));
        }
        application.httpCodeTarget5XXCount = httpCodeTarget5XXCount;
        /**
         * The number of requests where the load balancer chose a new target because it couldn't use
         * an existing sticky session. For example, the request was the first request from a new
         * client and no stickiness cookie was presented, a stickiness cookie was presented but it
         * did not specify a target that was registered with this target group, the stickiness
         * cookie was malformed or expired, or an internal error prevented the load balancer from
         * reading the stickiness cookie. Reporting criteria: Stickiness is enabled on the target
         * group.
         *
         * Statistics: The only meaningful statistic is Sum.
         */
        function nonStickyRequestCount(change) {
            return metric("NonStickyRequestCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.nonStickyRequestCount = nonStickyRequestCount;
        /**
         * The average number of requests received by each target in a target group. You must
         * specify the target group using the TargetGroup dimension. This metric does not apply if
         * the target is a Lambda function. Reporting criteria: Always reported
         *
         * Statistics: The only valid statistic is Sum. Note that this represents the average not
         * the sum.
         *
         * Dimensions: TargetGroup TargetGroup, LoadBalancer
         */
        function requestCountPerTarget(change) {
            return metric("RequestCountPerTarget", Object.assign({ statistic: "Sum" }, change));
        }
        application.requestCountPerTarget = requestCountPerTarget;
        /**
         * The number of connections that were not successfully established between the load
         * balancer and target. This metric does not apply if the target is a Lambda function.
         * Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function targetConnectionErrorCount(change) {
            return metric("TargetConnectionErrorCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.targetConnectionErrorCount = targetConnectionErrorCount;
        /**
         * The time elapsed, in seconds, after the request leaves the load balancer until a response
         * from the target is received. This is equivalent to the target_processing_time field in
         * the access logs. Reporting criteria: There is a nonzero value
         *
         * Statistics: The most useful statistics are Average and pNN.NN (percentiles).
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function targetResponseTime(change) {
            return metric("TargetResponseTime", Object.assign({}, change));
        }
        application.targetResponseTime = targetResponseTime;
        /**
         * The number of TLS connections initiated by the load balancer that did not establish a
         * session with the target. Possible causes include a mismatch of ciphers or protocols. This
         * metric does not apply if the target is a Lambda function. Reporting criteria: There is a
         * nonzero value
         *
         * Statistics: The most useful statistic is Sum.
         *
         * Dimensions: LoadBalancer AvailabilityZone, LoadBalancer TargetGroup, LoadBalancer
         * TargetGroup, AvailabilityZone, LoadBalancer
         */
        function targetTLSNegotiationErrorCount(change) {
            return metric("TargetTLSNegotiationErrorCount", Object.assign({ statistic: "Sum" }, change));
        }
        application.targetTLSNegotiationErrorCount = targetTLSNegotiationErrorCount;
        /**
         * The number of targets that are considered unhealthy. Reporting criteria: Reported if
         * health checks are enabled
         *
         * Statistics: The most useful statistics are Average, Minimum, and Maximum.
         *
         * Dimensions: TargetGroup, LoadBalancer TargetGroup, AvailabilityZone, LoadBalancer
         */
        function unHealthyHostCount(change) {
            return metric("UnHealthyHostCount", Object.assign({}, change));
        }
        application.unHealthyHostCount = unHealthyHostCount;
    })(application = metrics.application || (metrics.application = {}));
    let network;
    (function (network) {
        /**
         * Creates an AWS/NetworkELB metric with the requested [metricName]. See
         * https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-cloudwatch-metrics.html
         * for list of all metric-names.
         *
         * Elastic Load Balancing publishes data points to Amazon CloudWatch for your load balancers
         * and your targets. CloudWatch enables you to retrieve statistics about those data points
         * as an ordered set of time-series data, known as metrics. Think of a metric as a variable
         * to monitor, and the data points as the values of that variable over time. For example,
         * you can monitor the total number of healthy targets for a load balancer over a specified
         * time period. Each data point has an associated time stamp and an optional unit of
         * measurement.
         *
         * You can use metrics to verify that your system is performing as expected. For example,
         * you can create a CloudWatch alarm to monitor a specified metric and initiate an action
         * (such as sending a notification to an email address) if the metric goes outside what you
         * consider an acceptable range.
         *
         * Elastic Load Balancing reports metrics to CloudWatch only when requests are flowing
         * through the load balancer. If there are requests flowing through the load balancer,
         * Elastic Load Balancing measures and sends its metrics in 60-second intervals. If there
         * are no requests flowing through the load balancer or no data for a metric, the metric is
         * not reported.
         *
         * To filter the metrics for your Application Load Balancer, use the following dimensions.
         * 1. "AvailabilityZone": Filters the metric data by Availability Zone.
         * 2. "LoadBalancer": Filters the metric data by load balancer. Specify the load balancer
         *    using `LoadBalancer.arnSuffix`.
         * 3. "TargetGroup": Filters the metric data by target group. Specify the target group using
         *    `TargetGroup.arnSuffix`.
         */
        function metric(metricName, change = {}) {
            const dimensions = createDimensions(change);
            return new cloudwatch.Metric(Object.assign({ namespace: "AWS/NetworkELB ", name: metricName }, change)).withDimensions(dimensions);
        }
        /**
         * The total number of concurrent flows (or connections) from clients to targets. This
         * metric includes connections in the SYN_SENT and ESTABLISHED states. TCP connections are
         * not terminated at the load balancer, so a client opening a TCP connection to a target
         * counts as a single flow.
         *
         * Statistics: The most useful statistics are Average, Maximum, and Minimum.
         */
        function activeFlowCount(change) {
            return metric("ActiveFlowCount", Object.assign({}, change));
        }
        network.activeFlowCount = activeFlowCount;
        /**
         * The total number of concurrent TLS flows (or connections) from clients to targets. This
         * metric includes only connections in the ESTABLISHED states.
         *
         * Statistics: The most useful statistics are Average, Maximum, and Minimum.
         */
        function activeFlowCount_TLS(change) {
            return metric("ActiveFlowCount_TLS", Object.assign({}, change));
        }
        network.activeFlowCount_TLS = activeFlowCount_TLS;
        /**
         * The total number of TLS handshakes that failed during negotiation between a client and a
         * TLS listener.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function clientTLSNegotiationErrorCount(change) {
            return metric("ClientTLSNegotiationErrorCount", Object.assign({ statistic: "Sum" }, change));
        }
        network.clientTLSNegotiationErrorCount = clientTLSNegotiationErrorCount;
        /**
         * The number of load balancer capacity units (LCU) used by your load balancer. You pay for
         * the number of LCUs that you use per hour. For more information, see Elastic Load
         * Balancing Pricing.
         */
        function consumedLCUs(change) {
            return metric("ConsumedLCUs", Object.assign({}, change));
        }
        network.consumedLCUs = consumedLCUs;
        /**
         * The number of targets that are considered healthy.
         *
         * Statistics: The most useful statistics are Maximum and Minimum.
         */
        function healthyHostCount(change) {
            return metric("HealthyHostCount", Object.assign({ statistic: "Maximum" }, change));
        }
        network.healthyHostCount = healthyHostCount;
        /**
         * The total number of new flows (or connections) established from clients to targets in the
         * time period.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function newFlowCount(change) {
            return metric("NewFlowCount", Object.assign({ statistic: "Sum" }, change));
        }
        network.newFlowCount = newFlowCount;
        /**
         * The total number of new TLS flows (or connections) established from clients to targets in
         * the time period.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function newFlowCountTLS(change) {
            return metric("NewFlowCount_TLS", Object.assign({ statistic: "Sum" }, change));
        }
        network.newFlowCountTLS = newFlowCountTLS;
        /**
         * The total number of bytes processed by the load balancer, including TCP/IP headers.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function processedBytes(change) {
            return metric("ProcessedBytes", Object.assign({ statistic: "Sum" }, change));
        }
        network.processedBytes = processedBytes;
        /**
         * The total number of bytes processed by TLS listeners.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function processedBytesTLS(change) {
            return metric("ProcessedBytes_TLS", Object.assign({ statistic: "Sum" }, change));
        }
        network.processedBytesTLS = processedBytesTLS;
        /**
         * The total number of TLS handshakes that failed during negotiation between a TLS listener
         * and a target.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function targetTLSNegotiationErrorCount(change) {
            return metric("TargetTLSNegotiationErrorCount", Object.assign({ statistic: "Sum" }, change));
        }
        network.targetTLSNegotiationErrorCount = targetTLSNegotiationErrorCount;
        /**
         * The total number of reset (RST) packets sent from a client to a target. These resets are
         * generated by the client and forwarded by the load balancer.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function tcpClientResetCount(change) {
            return metric("TCP_Client_Reset_Count", Object.assign({ statistic: "Sum" }, change));
        }
        network.tcpClientResetCount = tcpClientResetCount;
        /**
         * The total number of reset (RST) packets generated by the load balancer.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function tcpELBResetCount(change) {
            return metric("TCP_ELB_Reset_Count", Object.assign({ statistic: "Sum" }, change));
        }
        network.tcpELBResetCount = tcpELBResetCount;
        /**
         * The total number of reset (RST) packets sent from a target to a client. These resets are
         * generated by the target and forwarded by the load balancer.
         *
         * Statistics: The most useful statistic is Sum.
         */
        function tcpTargetResetCount(change) {
            return metric("TCP_Target_Reset_Count", Object.assign({ statistic: "Sum" }, change));
        }
        network.tcpTargetResetCount = tcpTargetResetCount;
        /**
         * The number of targets that are considered unhealthy.
         *
         * Statistics: The most useful statistics are Maximum and Minimum.
         */
        function unhealthyHostCount(change) {
            return metric("UnHealthyHostCount", Object.assign({ statistic: "Maximum" }, change));
        }
        network.unhealthyHostCount = unhealthyHostCount;
    })(network = metrics.network || (metrics.network = {}));
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map