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
const utils = require("../utils");
/**
 * Step scaling policies increase or decrease the current capacity of your Auto Scaling group based
 * on a set of scaling adjustments, known as step adjustments. The adjustments vary based on the
 * size of the alarm breach.
 *
 * For example, consider the following StepScaling description for an ASG that has both a current
 * capacity and a desired capacity of 10. The current and desired capacity is maintained while the
 * aggregated metric value is greater than 40 and less than 60.
 *
 * ```ts
 *  const policy = {
 *      // ... other values
 *      adjustmentType: "PercentChangeInCapacity",
 *      steps: {
 *          upper: [{ value: 60, adjustment: 10 }, { value: 70, adjustment: 30 }],
 *          lower: [{ value: 40, adjustment: -10 }, { value: 30, adjustment: -30 }]
 *      },
 *  };
 * ```
 *
 * If the metric value gets to 60, Application Auto Scaling increases the desired capacity of the
 * group by 1, to 11. That's based on the second step adjustment of the scale-out policy (add 10
 * percent of 10). After the new capacity is added, Application Auto Scaling increases the current
 * capacity to 11. If the metric value rises to 70 even after this increase in capacity, Application
 * Auto Scaling increases the target capacity by 3, to 14. That's based on the third step adjustment
 * of the scale-out policy (add 30 percent of 11, 3.3, rounded down to 3).
 *
 * If the metric value gets to 40, Application Auto Scaling decreases the target capacity by 1, to
 * 13, based on the second step adjustment of the scale-in policy (remove 10 percent of 14, 1.4,
 * rounded down to 1). If the metric value falls to 30 even after this decrease in capacity,
 * Application Auto Scaling decreases the target capacity by 3, to 10, based on the third step
 * adjustment of the scale-in policy (remove 30 percent of 13, 3.9, rounded down to 3).
 */
class StepScalingPolicy extends pulumi.ComponentResource {
    constructor(name, group, args, opts = {}) {
        super("awsx:autoscaling:StepScalingPolicy", name, undefined, Object.assign({ parent: group }, opts));
        if (!args.steps.upper && !args.steps.lower) {
            throw new Error("At least one of [args.steps.upper] and [args.steps.lower] must be provided.");
        }
        const convertedSteps = pulumi.output(args.steps).apply(s => convertSteps(s));
        const metricAggregationType = pulumi.output(args.metric.statistic).apply(s => {
            if (s !== "Minimum" && s !== "Maximum" && s !== "Average") {
                throw new Error(`[args.metric.statistic] must be one of "Minimum", "Maximum" or "Average", but was: ${s}`);
            }
            return s;
        });
        const commonArgs = Object.assign({ autoscalingGroupName: group.group.name, policyType: "StepScaling", metricAggregationType }, args);
        // AutoScaling recommends a metric of 60 to ensure that adjustments can happen in a timely
        // manner.
        const metric = args.metric.withPeriod(60);
        const evaluationPeriods = utils.ifUndefined(args.evaluationPeriods, 1);
        if (args.steps.upper) {
            this.upperPolicy = new aws.autoscaling.Policy(`${name}-upper`, Object.assign(Object.assign({}, commonArgs), { stepAdjustments: convertedSteps.upper.stepAdjustments }), { parent: this });
            this.upperAlarm = metric.createAlarm(`${name}-upper`, {
                evaluationPeriods,
                // step ranges and alarms are inclusive on the lower end.
                comparisonOperator: "GreaterThanOrEqualToThreshold",
                threshold: convertedSteps.upper.threshold,
                alarmActions: [this.upperPolicy.arn],
            }, { parent: this });
        }
        if (args.steps.lower) {
            this.lowerPolicy = new aws.autoscaling.Policy(`${name}-lower`, Object.assign(Object.assign({}, commonArgs), { stepAdjustments: convertedSteps.lower.stepAdjustments }), { parent: this });
            this.lowerAlarm = metric.createAlarm(`${name}-lower`, {
                evaluationPeriods,
                // step ranges and alarms are inclusive on the upper end.
                comparisonOperator: "LessThanOrEqualToThreshold",
                threshold: convertedSteps.lower.threshold,
                alarmActions: [this.lowerPolicy.arn],
            }, { parent: this });
        }
        this.registerOutputs();
    }
}
exports.StepScalingPolicy = StepScalingPolicy;
/** @internal */
function convertSteps(steps) {
    // First, order so that smaller values comes first.
    const upperSteps = sortSteps(steps.upper);
    const lowerSteps = sortSteps(steps.lower);
    const result = {
        upper: convertUpperSteps(upperSteps),
        lower: convertLowerSteps(lowerSteps),
    };
    if (upperSteps && lowerSteps) {
        const lowerStep = lowerSteps[lowerSteps.length - 1];
        const upperStep = upperSteps[0];
        if (lowerStep.value >= upperStep.value) {
            throw new Error(`Lower and upper steps cannot overlap. Lower step value ${lowerStep.value} greater than upper step value ${upperStep.value}`);
        }
    }
    return result;
}
exports.convertSteps = convertSteps;
/** @internal */
function convertUpperSteps(upperSteps) {
    // First, order so that smaller values comes first.
    upperSteps = sortSteps(upperSteps);
    if (!upperSteps) {
        return undefined;
    }
    if (upperSteps.length === 0) {
        throw new Error("[args.steps.upper] must be non-empty.");
    }
    // The threshold is the value of the first step.  This is the point where we'll set the alarm
    // to fire.  Note: in the aws description, steps are offset from this.  So if the breach-point is
    // 50, and the step value is 65, then we'll set metricIntervalLowerBound to 15.
    const threshold = upperSteps[0].value;
    const stepAdjustments = [];
    for (let i = 0, n = upperSteps.length; i < n; i++) {
        const step = upperSteps[i];
        const nextStep = i === n - 1 ? undefined : upperSteps[i + 1];
        if (nextStep) {
            if (step.value === nextStep.value) {
                throw new Error(`Upper steps contained two steps with the same [value]: ${step.value}`);
            }
        }
        stepAdjustments.push({
            metricIntervalLowerBound: (step.value - threshold).toString(),
            // if this is the last step, extend it to infinity (using 'undefined').  Otherwise,
            // extend it to the next step.
            metricIntervalUpperBound: nextStep ? (nextStep.value - threshold).toString() : undefined,
            scalingAdjustment: step.adjustment,
        });
    }
    return { threshold, stepAdjustments };
}
exports.convertUpperSteps = convertUpperSteps;
function sortSteps(steps) {
    if (!steps) {
        return undefined;
    }
    return steps.sort((s1, s2) => s1.value - s2.value);
}
/** @internal */
function convertLowerSteps(lowerSteps) {
    // First, order so that smaller values comes first.
    lowerSteps = sortSteps(lowerSteps);
    if (!lowerSteps) {
        return undefined;
    }
    if (lowerSteps.length === 0) {
        throw new Error("[args.steps.lower] must be non-empty.");
    }
    // The threshold is the value of the last step.  This is the point where we'll set the alarm to
    // fire.  Note: in the aws description, steps are offset from this.  So if the breach-point is
    // 50, and the step value is 35, then we'll set metricIntervalUpperBound to -15.
    const threshold = lowerSteps[lowerSteps.length - 1].value;
    const stepAdjustments = [];
    for (let i = 0, n = lowerSteps.length; i < n; i++) {
        const step = lowerSteps[i];
        const previousStep = i === 0 ? undefined : lowerSteps[i - 1];
        if (previousStep) {
            if (step.value === previousStep.value) {
                throw new Error(`Lower steps contained two steps with the same [value]: ${step.value}`);
            }
        }
        stepAdjustments.push({
            // if this is the first step, extend it to -infinity (using 'undefined').  Otherwise,
            // extend it to the next step.
            metricIntervalLowerBound: previousStep ? (previousStep.value - threshold).toString() : undefined,
            metricIntervalUpperBound: (step.value - threshold).toString(),
            scalingAdjustment: step.adjustment,
        });
    }
    return { threshold, stepAdjustments };
}
exports.convertLowerSteps = convertLowerSteps;
//# sourceMappingURL=stepScaling.js.map