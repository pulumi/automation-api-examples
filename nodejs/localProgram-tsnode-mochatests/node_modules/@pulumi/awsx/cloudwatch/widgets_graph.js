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
const widgets_simple_1 = require("./widgets_simple");
/**
 * Base type for widets that display metrics as a graph (either a line or stacked graph).
 *
 * See https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph_metrics.html for more
 * details.
 */
class GraphMetricWidget extends widgets_simple_1.MetricWidget {
    constructor(graphArgs) {
        super(graphArgs);
        this.graphArgs = graphArgs;
        this.computeView = () => "timeSeries";
        this.computeYAxis = () => this.graphArgs.yAxis;
    }
}
exports.GraphMetricWidget = GraphMetricWidget;
/**
 * Displays a set of metrics as a line graph.
 */
class LineGraphMetricWidget extends GraphMetricWidget {
    constructor(args) {
        super(args);
        this.computedStacked = () => false;
    }
}
exports.LineGraphMetricWidget = LineGraphMetricWidget;
/**
 * Displays a set of metrics as a stacked area graph.
 */
class StackedAreaGraphMetricWidget extends GraphMetricWidget {
    constructor(args) {
        super(args);
        this.computedStacked = () => true;
    }
}
exports.StackedAreaGraphMetricWidget = StackedAreaGraphMetricWidget;
/**
 * Displays a set of metrics as a single number.
 */
class SingleNumberMetricWidget extends widgets_simple_1.MetricWidget {
    constructor(args) {
        super(args);
        this.computedStacked = () => false;
        this.computeView = () => "singleValue";
        this.computeYAxis = () => undefined;
    }
}
exports.SingleNumberMetricWidget = SingleNumberMetricWidget;
//# sourceMappingURL=widgets_graph.js.map