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
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const x = require("..");
const utils = require("../utils");
const launchConfiguration_1 = require("./launchConfiguration");
const schedule_1 = require("./schedule");
const stepScaling = require("./stepScaling");
const targetTracking = require("./targetTracking");
class AutoScalingGroup extends pulumi.ComponentResource {
    constructor(name, args, opts = {}) {
        super("awsx:x:autoscaling:AutoScalingGroup", name, {}, opts);
        this.vpc = args.vpc || x.ec2.Vpc.getDefault({ parent: this });
        const subnetIds = args.subnetIds || this.vpc.privateSubnetIds;
        this.targetGroups = args.targetGroups || [];
        const targetGroupArns = this.targetGroups.map(g => g.targetGroup.arn);
        // Use the autoscaling config provided, otherwise just create a default one for this cluster.
        if (args.launchConfiguration) {
            this.launchConfiguration = args.launchConfiguration;
        }
        else {
            this.launchConfiguration = new launchConfiguration_1.AutoScalingLaunchConfiguration(name, this.vpc, args.launchConfigurationArgs, { parent: this });
        }
        // Use cloudformation to actually construct the autoscaling group.
        this.stack = new aws.cloudformation.Stack(name, Object.assign(Object.assign({}, args), { name: this.launchConfiguration.stackName, templateBody: getCloudFormationTemplate(name, this.launchConfiguration.id, subnetIds, targetGroupArns, utils.ifUndefined(args.templateParameters, {})) }), { parent: this });
        // Now go and actually find the group created by cloudformation.  The id for the group will
        // be stored in `stack.outputs.Instances`.
        this.group = aws.autoscaling.Group.get(name, this.stack.outputs["Instances"], undefined, { parent: this });
        this.registerOutputs();
    }
    scaleOnSchedule(name, args, opts = {}) {
        const recurrence = args.recurrence === undefined
            ? undefined
            : pulumi.output(args.recurrence).apply(x => typeof x === "string" ? x : schedule_1.cronExpression(x));
        return new aws.autoscaling.Schedule(name, Object.assign(Object.assign({}, args), { recurrence, autoscalingGroupName: this.group.name, scheduledActionName: args.scheduledActionName || name, 
            // Have to explicitly set these to -1.  If we pass 'undefined' through these will become
            // 0, which will actually set the size/capacity to that.
            minSize: utils.ifUndefined(args.minSize, -1), maxSize: utils.ifUndefined(args.maxSize, -1), desiredCapacity: utils.ifUndefined(args.desiredCapacity, -1) }), Object.assign({ parent: this }, opts));
    }
    /**
     * With target tracking scaling policies, you select a scaling metric and set a target value.
     * Amazon EC2 Auto Scaling creates and manages the CloudWatch alarms that trigger the scaling
     * policy and calculates the scaling adjustment based on the metric and the target value. The
     * scaling policy adds or removes capacity as required to keep the metric at, or close to, the
     * specified target value. In addition to keeping the metric close to the target value, a target
     * tracking scaling policy also adjusts to the changes in the metric due to a changing load
     * pattern.
     *
     * For example, you can use target tracking scaling to:
     *
     * * Configure a target tracking scaling policy to keep the average aggregate CPU utilization of
     *   your Auto Scaling group at 50 percent.
     *
     * * Configure a target tracking scaling policy to keep the request count per target of your
     *   Elastic Load Balancing target group at 1000 for your Auto Scaling group.
     *
     * We recommend that you scale on Amazon EC2 instance metrics with a 1-minute frequency because
     * that ensures a faster response to utilization changes. Scaling on metrics with a 5-minute
     * frequency can result in slower response times and scaling on stale metric data. By default,
     * Amazon EC2 instances are enabled for basic monitoring, which means metric data for instances
     * is available at 5-minute intervals. You can enable detailed monitoring to get metric data for
     * instances at 1-minute frequency. For more information, see
     * [Configure-Monitoring-for-Auto-Scaling-Instances](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-monitoring.html#enable-as-instance-metrics).
     *
     * See https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html for
     * more details.
     */
    scaleToTrackMetric(name, args, opts) {
        return targetTracking.createCustomMetricPolicy(name, this, args, opts);
    }
    /**
     * Scales in response to the average CPU utilization of the [AutoScalingGroup].
     */
    scaleToTrackAverageCPUUtilization(name, args, opts) {
        return targetTracking.createPredefinedMetricPolicy(name, this, Object.assign({ predefinedMetricType: "ASGAverageCPUUtilization" }, args), opts);
    }
    /**
     * Scales in response to the average number of bytes received on all network interfaces by the
     * [AutoScalingGroup].
     */
    scaleToTrackAverageNetworkIn(name, args, opts) {
        return targetTracking.createPredefinedMetricPolicy(name, this, Object.assign({ predefinedMetricType: "ASGAverageNetworkIn" }, args), opts);
    }
    /**
     * Scales in response to the average number of bytes sent out on all network interfaces by the
     * [AutoScalingGroup].
     */
    scaleToTrackAverageNetworkOut(name, args, opts) {
        return targetTracking.createPredefinedMetricPolicy(name, this, Object.assign({ predefinedMetricType: "ASGAverageNetworkOut" }, args), opts);
    }
    /**
     * Scales in response to the number of requests completed per target in an [TargetGroup].
     * [AutoScalingGroup].  These [TargetGroup]s must have been provided to the [AutoScalingGroup]
     * when constructed using [AutoScalingGroupArgs.targetGroups].
     */
    scaleToTrackRequestCountPerTarget(name, args, opts) {
        const targetGroup = args.targetGroup;
        if (this.targetGroups.indexOf(targetGroup) < 0) {
            throw new Error("AutoScalingGroup must have been created with [args.targetGroup] to support scaling by request count.");
        }
        // loadbalancer-arnsuffix/targetgroup-arnsuffix is the format necessary to specify an
        // AppTargetGroup for a tracking policy.  See
        // https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_PredefinedMetricSpecification.html
        // for more details.
        const loadBalancerSuffix = targetGroup.loadBalancer.loadBalancer.arnSuffix;
        const targetGroupSuffix = targetGroup.targetGroup.arnSuffix;
        return targetTracking.createPredefinedMetricPolicy(name, this, Object.assign({ predefinedMetricType: "ALBRequestCountPerTarget", resourceLabel: pulumi.interpolate `${loadBalancerSuffix}/${targetGroupSuffix}` }, args), pulumi.mergeOptions(opts, { dependsOn: targetGroup.getListenersAsync() }));
    }
    /**
     * Creates a [StepScalingPolicy]  that increases or decreases the current capacity of this
     * AutoScalingGroup based on a set of scaling adjustments, known as step adjustments. The
     * adjustments vary based on the size of the alarm breach.
     *
     * See [StepScalingPolicy] for more details.
     */
    scaleInSteps(name, args, opts) {
        return new stepScaling.StepScalingPolicy(name, this, args, opts);
    }
}
exports.AutoScalingGroup = AutoScalingGroup;
function ifUndefined(val, defVal) {
    return val !== undefined ? val : defVal;
}
// TODO[pulumi/pulumi-aws/issues#43]: We'd prefer not to use CloudFormation, but it's the best way to implement
// rolling updates in an autoscaling group.
function getCloudFormationTemplate(instanceName, instanceLaunchConfigurationId, subnetIds, targetGroupArns, parameters) {
    return pulumi.all([subnetIds, targetGroupArns, instanceLaunchConfigurationId, parameters])
        .apply(([subnetIdsArray, targetGroupArns, instanceLaunchConfigurationId, parameters]) => {
        const minSize = ifUndefined(parameters.minSize, 2);
        const maxSize = ifUndefined(parameters.maxSize, 100);
        const desiredCapacity = ifUndefined(parameters.desiredCapacity, minSize);
        const cooldown = ifUndefined(parameters.defaultCooldown, 300);
        const healthCheckGracePeriod = ifUndefined(parameters.healthCheckGracePeriod, 120);
        const healthCheckType = ifUndefined(parameters.healthCheckType, "EC2");
        const suspendProcesses = ifUndefined(parameters.suspendedProcesses, ["ScheduledActions"]);
        let suspendProcessesString = "";
        for (let i = 0, n = suspendProcesses.length; i < n; i++) {
            const sp = suspendProcesses[i];
            if (i > 0) {
                suspendProcessesString += "\n";
            }
            suspendProcessesString += "                    -   " + sp;
        }
        let result = `
    AWSTemplateFormatVersion: '2010-09-09'
    Outputs:
        Instances:
            Value: !Ref Instances
    Resources:
        Instances:
            Type: AWS::AutoScaling::AutoScalingGroup
            Properties:
                Cooldown: ${cooldown}
                DesiredCapacity: ${desiredCapacity}
                HealthCheckGracePeriod: ${healthCheckGracePeriod}
                HealthCheckType: ${healthCheckType}
                LaunchConfigurationName: "${instanceLaunchConfigurationId}"
                MaxSize: ${maxSize}
                MetricsCollection:
                -   Granularity: 1Minute
                MinSize: ${minSize}`;
        if (targetGroupArns.length) {
            result += `
                TargetGroupARNs: ${JSON.stringify(targetGroupArns)}`;
        }
        result += `
                VPCZoneIdentifier: ${JSON.stringify(subnetIdsArray)}
                Tags:
                -   Key: Name
                    Value: ${instanceName}
                    PropagateAtLaunch: true
            CreationPolicy:
                ResourceSignal:
                    Count: ${minSize}
                    Timeout: PT15M
            UpdatePolicy:
                AutoScalingRollingUpdate:
                    MaxBatchSize: 1
                    MinInstancesInService: ${minSize}
                    PauseTime: PT15M
                    SuspendProcesses:
${suspendProcessesString}
                    WaitOnResourceSignals: true
    `;
        return result;
    });
}
// Make sure our exported args shape is compatible with the overwrite shape we're trying to provide.
const test1 = utils.checkCompat();
//# sourceMappingURL=autoscaling.js.map