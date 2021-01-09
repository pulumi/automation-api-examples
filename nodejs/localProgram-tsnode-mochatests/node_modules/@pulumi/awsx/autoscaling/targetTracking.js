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
const x = require("..");
/** @internal */
function createPolicy(name, group, args, targetTrackingConfiguration, opts = {}) {
    return new aws.autoscaling.Policy(name, {
        policyType: "TargetTrackingScaling",
        autoscalingGroupName: group.group.name,
        targetTrackingConfiguration: targetTrackingConfiguration,
        estimatedInstanceWarmup: args.estimatedInstanceWarmup,
    }, Object.assign({ parent: group }, opts));
}
exports.createPolicy = createPolicy;
/** @internal */
function createPredefinedMetricPolicy(name, group, args, opts) {
    return createPolicy(name, group, args, {
        disableScaleIn: args.disableScaleIn,
        targetValue: args.targetValue,
        predefinedMetricSpecification: {
            predefinedMetricType: args.predefinedMetricType,
            resourceLabel: args.resourceLabel,
        },
    }, opts);
}
exports.createPredefinedMetricPolicy = createPredefinedMetricPolicy;
/** @internal */
function createCustomMetricPolicy(name, group, args, opts) {
    return createPolicy(name, group, args, {
        disableScaleIn: args.disableScaleIn,
        targetValue: args.targetValue,
        customizedMetricSpecification: {
            namespace: args.metric.namespace,
            metricName: args.metric.name,
            unit: args.metric.unit.apply(u => u),
            statistic: x.cloudwatch.statisticString(args.metric),
            metricDimensions: convertDimensions(args.metric.dimensions),
        },
    }, opts);
}
exports.createCustomMetricPolicy = createCustomMetricPolicy;
function convertDimensions(dimensions) {
    if (dimensions === undefined) {
        return dimensions;
    }
    return dimensions.apply(d => {
        if (!d) {
            return [];
        }
        const result = [];
        for (const key of Object.keys(d)) {
            result.push({ name: key, value: d[key] });
        }
        return result;
    });
}
//# sourceMappingURL=targetTracking.js.map