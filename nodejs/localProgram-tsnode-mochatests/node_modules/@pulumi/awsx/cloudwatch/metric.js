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
const widgets_simple_1 = require("./widgets_simple");
const utils = require("../utils");
/**
 * Metrics are the fundamental concept in CloudWatch. A metric represents a time-ordered set of data
 * points that are published to CloudWatch. Think of a metric as a variable to monitor, and the data
 * points as representing the values of that variable over time. For example, the CPU usage of a
 * particular EC2 instance is one metric provided by Amazon EC2. The data points themselves can come
 * from any application or business activity from which you collect data.
 *
 * AWS services send metrics to CloudWatch, and you can send your own custom metrics to CloudWatch.
 * You can add the data points in any order, and at any rate you choose. You can retrieve statistics
 * about those data points as an ordered set of time-series data.
 *
 * Metrics exist only in the region in which they are created. Metrics cannot be deleted, but they
 * automatically expire after 15 months if no new data is published to them. Data points older than
 * 15 months expire on a rolling basis; as new data points come in, data older than 15 months is
 * dropped.
 *
 * Metrics are uniquely defined by a name, a namespace, and zero or more dimensions. Each data point
 * in a metric has a time stamp, and (optionally) a unit of measure. You can retrieve statistics
 * from CloudWatch for any metric.
 *
 * see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Metric
 * for more details.
 */
class Metric {
    /**
     * @param resource Optional resource this is a metric for.  This is only used for parenting
     * purposes.  i.e. if an [Alarm] is created from this [Metric], then [resource] will be used as
     * the parent of the alarm by default.
     */
    constructor(args, resource) {
        this.resource = resource;
        this.name = pulumi.output(args.name);
        if (args.dimensions) {
            this.dimensions = pulumi.output(args.dimensions);
        }
        this.namespace = pulumi.output(args.namespace);
        this.period = utils.ifUndefined(args.period, 300).apply(p => validatePeriod(p));
        this.statistic = pulumi.all([args.statistic, args.extendedStatistic])
            .apply(([statistic, extendedStatistic]) => validateStatistics(statistic, extendedStatistic));
        this.extendedStatistic = pulumi.output(args.extendedStatistic).apply(es => validateExtendedStatistic(es));
        this.unit = pulumi.output(args.unit);
        // Only for metrics that are placed in dashboards.
        this.color = pulumi.output(args.color);
        this.label = pulumi.output(args.label);
        this.visible = utils.ifUndefined(args.visible, true);
        this.yAxis = utils.ifUndefined(args.yAxis, "left");
    }
    with(change) {
        if (!change) {
            return this;
        }
        let result = this;
        result = hasOwnProperty(change, "dimensions") ? result.withDimensions(change.dimensions) : result;
        result = hasOwnProperty(change, "period") ? result.withPeriod(change.period) : result;
        result = hasOwnProperty(change, "statistic") ? result.withStatistic(change.statistic) : result;
        result = hasOwnProperty(change, "extendedStatistic") ? result.withExtendedStatistic(change.extendedStatistic) : result;
        result = hasOwnProperty(change, "unit") ? result.withUnit(change.unit) : result;
        result = hasOwnProperty(change, "color") ? result.withColor(change.color) : result;
        result = hasOwnProperty(change, "label") ? result.withLabel(change.label) : result;
        result = hasOwnProperty(change, "visible") ? result.withVisible(change.visible) : result;
        result = hasOwnProperty(change, "yAxis") ? result.withYAxis(change.yAxis) : result;
        return result;
    }
    features() {
        return {
            namespace: this.namespace,
            name: this.name,
            dimensions: this.dimensions,
            period: this.period,
            statistic: this.statistic,
            extendedStatistic: this.extendedStatistic,
            unit: this.unit,
        };
    }
    spread() {
        return {
            resource: this.resource,
            namespace: this.namespace,
            name: this.name,
            dimensions: this.dimensions,
            period: this.period,
            statistic: this.statistic,
            extendedStatistic: this.extendedStatistic,
            unit: this.unit,
            color: this.color,
            label: this.label,
            visible: this.visible,
            yAxis: this.yAxis,
        };
    }
    /**
     * Produces a new [Metric] instances with the specific [dimensions] of this instance overwritten
     * with the [dimensions] pass in as arguments.  Because this is a merging, to unset a particular
     * dimension, pass in an explicit value of `{ name: undefined }`.  To clear all dimensions, pass
     * in `undefined` for the entire argument.
     */
    withDimensions(dimensions) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { dimensions: mergeDimensions(this.dimensions, dimensions) }), this.resource);
    }
    withPeriod(period) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { period }), this.resource);
    }
    withUnit(unit) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { unit }), this.resource);
    }
    withColor(color) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { color }), this.resource);
    }
    withLabel(label) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { label }), this.resource);
    }
    withVisible(visible) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { visible }), this.resource);
    }
    withYAxis(yAxis) {
        return new Metric(Object.assign(Object.assign({}, this.spread()), { yAxis }), this.resource);
    }
    withStatistic(statistic) {
        // If they're supplying a statistic, then we want to clear out extendedStatistic.
        return new Metric(Object.assign(Object.assign({}, this.spread()), { statistic, extendedStatistic: pulumi.all([statistic, this.extendedStatistic])
                .apply(([statistic, extendedStatistic]) => statistic !== undefined ? undefined : extendedStatistic) }), this.resource);
    }
    withExtendedStatistic(extendedStatistic) {
        // If they're supplying an extendedStatistic, then we want to clear out statistic.
        return new Metric(Object.assign(Object.assign({}, this.spread()), { statistic: pulumi.all([this.statistic, extendedStatistic])
                .apply(([statistic, extendedStatistic]) => extendedStatistic !== undefined ? undefined : statistic), extendedStatistic }), this.resource);
    }
    createAlarm(name, args, opts = {}) {
        const comparisonOperator = utils.ifUndefined(args.comparisonOperator, "GreaterThanOrEqualToThreshold");
        return new aws.cloudwatch.MetricAlarm(name, Object.assign(Object.assign({}, args), { comparisonOperator, actionsEnabled: utils.ifUndefined(args.actionsEnabled, true), alarmDescription: computeDescription(this, args, comparisonOperator), treatMissingData: utils.ifUndefined(args.treatMissingData, "missing"), dimensions: this.dimensions, extendedStatistic: this.extendedStatistic.apply(s => s === undefined ? undefined : `p${s}`), metricName: this.name, namespace: this.namespace, period: this.period, statistic: this.statistic, unit: this.unit.apply(u => u) }), Object.assign({ parent: this.resource }, opts));
    }
    /** For internal use only. */
    addWidgetJson(metrics) {
        // Each single metric in the metrics array has the following format:
        // [Namespace, MetricName, [{DimensionName,DimensionValue}...] [Rendering Properties Object] ]
        // See: https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html#CloudWatch-Dashboard-Properties-Metrics-Array-Format
        const op = pulumi.all([this.spread(), widgets_simple_1.statisticString(this.spread())]).apply(([uw, stat]) => {
            const result = [];
            if (uw.period % 60 !== 0) {
                throw new Error(`Dashboard metric period must be a multiple of 60: ${uw.period}`);
            }
            result.push(uw.namespace);
            result.push(uw.name);
            // note that dimensions are just added added directly into the array, there's no
            // sub-array or other structure to hold them.
            if (uw.dimensions) {
                for (const key in uw.dimensions) {
                    if (uw.dimensions.hasOwnProperty(key)) {
                        result.push(key);
                        result.push(uw.dimensions[key]);
                    }
                }
            }
            const renderingProps = {
                stat,
                color: uw.color,
                label: uw.label,
                period: uw.period,
                visible: uw.visible,
                yAxis: uw.yAxis,
            };
            result.push(renderingProps);
            return result;
        });
        metrics.push(op);
    }
}
exports.Metric = Metric;
/** @internal */
function mergeDimensions(oldDimensions, newDimensions) {
    if (!newDimensions) {
        // they're explicitly clearing out all dimensions.
        return undefined;
    }
    return pulumi.all([oldDimensions, newDimensions]).apply(([oldDimensions, newDimensions]) => {
        if (!oldDimensions) {
            // no old dimensions, can just use all the new dimensions passed in.
            return newDimensions;
        }
        // have both old and new.  need to overwrite all the old dimensions with whatever is in new.
        const result = Object.assign({}, oldDimensions);
        for (const name in newDimensions) {
            if (newDimensions.hasOwnProperty(name)) {
                result[name] = newDimensions[name];
            }
        }
        return result;
    });
}
exports.mergeDimensions = mergeDimensions;
function hasOwnProperty(obj, key) {
    return obj.hasOwnProperty(key);
}
function computeDescription(metric, args, comparisonOperator) {
    return pulumi.all([metric, args, comparisonOperator])
        .apply(([metric, args, comparisonOperator]) => {
        if (args.alarmDescription !== undefined) {
            return args.alarmDescription;
        }
        const name = metric.label || metric.name;
        const op = operatorDescription(comparisonOperator);
        const period = args.evaluationPeriods === 1
            ? `for 1 datapoint`
            : `for ${args.evaluationPeriods} datapoints`;
        const time = args.evaluationPeriods * metric.period;
        const timeDesc = time % 60 === 0
            ? `within ${time / 60} minutes`
            : `within ${time} seconds`;
        return `${name} ${op} ${args.threshold} ${period} ${timeDesc}`;
    });
}
function operatorDescription(op) {
    switch (op) {
        case "GreaterThanOrEqualToThreshold": return ">=";
        case "GreaterThanThreshold": return ">";
        case "LessThanThreshold": return "<";
        case "LessThanOrEqualToThreshold": return "<=";
        default: throw new Error(`Unexpected comparison operator: ${op}`);
    }
}
function validatePeriod(period) {
    // valid values for period are 1, 5, 10, 30, or any multiple of 60
    if (period !== 1 && period !== 5 && period !== 10 && period !== 30 && period % 60 !== 0) {
        throw new Error("Valid values for [args.period] are 1, 5, 10, 30, or any multiple of 60");
    }
    return period;
}
function validateStatistics(statistic, extendedStatistic) {
    if (statistic === undefined && extendedStatistic === undefined) {
        return "Average";
    }
    if (statistic !== undefined && extendedStatistic !== undefined) {
        throw new Error("Only provide one of [args.statistic] and [args.extendedStatistic]");
    }
    return statistic;
}
function validateExtendedStatistic(extendedStatistic) {
    if (extendedStatistic !== undefined) {
        if (extendedStatistic < 0 || extendedStatistic > 100) {
            throw new Error("[args.extendedStatistic] must be between 0 and 100.");
        }
    }
    return extendedStatistic;
}
//# sourceMappingURL=metric.js.map