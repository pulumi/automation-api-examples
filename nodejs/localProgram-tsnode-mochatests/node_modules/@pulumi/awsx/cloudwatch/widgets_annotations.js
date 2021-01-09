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
const pulumi = require("@pulumi/pulumi");
/**
 * Adds an alarm annotation to a [MetricWidget], allowing a metric alarm to be displayed in a
 * Dashboard.
 */
class AlarmAnnotation {
    constructor(alarmArn) {
        this.alarmArn = alarmArn;
    }
    /** For internal use only. */
    addWidgetJson(annotations) {
        if (annotations.alarms && annotations.alarms.length >= 1) {
            throw new Error("Widget can only have a maximum of one alarm annotation.");
        }
        annotations.alarms = [this.alarmArn];
    }
}
exports.AlarmAnnotation = AlarmAnnotation;
function isHorizontalAlarmAnnotationArgs(obj) {
    return obj.threshold !== undefined;
}
/**
 * Horizontal annotations have several options for fill shading, including shading above the
 * annotation line, shading below the annotation line, and "band" shading that appears between two
 * linked annotation lines as part of a single band annotation
 */
class HorizontalAnnotation {
    constructor(args) {
        if (isHorizontalAlarmAnnotationArgs(args)) {
            this.args = {
                aboveEdge: {
                    label: pulumi.output(args.alarmDescription),
                    value: pulumi.output(args.threshold).apply(v => v || 0),
                },
            };
        }
        else {
            this.args = args;
        }
        if (this.args.fill && this.args.belowEdge) {
            throw new Error(`[args.fill] should not be provided if [args.belowEdge] is provided.`);
        }
    }
    /** For internal use only. */
    addWidgetJson(annotations) {
        annotations.horizontal = annotations.horizontal || [];
        const annotation = {
            fill: this.args.fill,
            color: this.args.color,
            label: this.args.aboveEdge.label,
            value: this.args.aboveEdge.value,
            visible: this.args.visible,
            yAxis: this.args.yAxis,
        };
        annotations.horizontal.push(annotation);
        if (this.args.belowEdge) {
            annotations.horizontal.push({
                value: this.args.belowEdge.value,
                label: this.args.belowEdge.label,
            });
        }
    }
}
exports.HorizontalAnnotation = HorizontalAnnotation;
/**
 * Vertical annotations have several options for fill shading, including shading before the
 * annotation line, shading after the annotation line, and "band" shading that appears between two
 * linked annotation lines as part of a single band annotation
 */
class VerticalAnnotation {
    constructor(args) {
        this.args = args;
        if (args.fill && args.afterEdge) {
            throw new Error(`[args.fill] should not be provided if [args.afterEdge] is provided.`);
        }
    }
    /** For internal use only. */
    addWidgetJson(annotations) {
        annotations.vertical = annotations.vertical || [];
        const annotation = {
            fill: this.args.fill,
            color: this.args.color,
            label: this.args.beforeEdge.label,
            value: this.args.beforeEdge.value,
            visible: this.args.visible,
        };
        annotations.vertical.push(annotation);
        if (this.args.afterEdge) {
            annotations.vertical.push({
                value: this.args.afterEdge.value,
                label: this.args.afterEdge.label,
            });
        }
    }
}
exports.VerticalAnnotation = VerticalAnnotation;
//# sourceMappingURL=widgets_annotations.js.map