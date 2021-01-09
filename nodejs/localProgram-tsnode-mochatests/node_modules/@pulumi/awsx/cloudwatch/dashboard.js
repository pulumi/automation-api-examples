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
const widgets_flow_1 = require("./widgets_flow");
const utils = require("../utils");
/**
 * [Dashboard]s are represented by a grid of columns 24 wide, with an unlimited number of rows.
 *
 * Each [Widget] in the [Dashboard] have a specific width/height in terms of grid units.
 *
 * A [Dashboard] can include up to 100 widgets.  See
 * https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html#CloudWatch-Dashboard-Properties-Rendering-Object-Format
 * for more details.
 */
class Dashboard extends aws.cloudwatch.Dashboard {
    /**
     * Constructs a [DashboardGrid] out of [Widget]s.  If any of these Widgets are [RowWidget]s.
     * then these will be treated as a sequence of rows to add to the grid.  Otherwise, this will
     * be treated as a single row to add to the grid.
     */
    constructor(name, args, opts = {}) {
        const region = utils.ifUndefined(args.region, utils.getRegionFromOpts(opts));
        super(name, {
            dashboardName: utils.ifUndefined(args.name, name),
            dashboardBody: getDashboardBody(args, region).apply(b => JSON.stringify(b)),
        }, opts);
        this.url = pulumi.interpolate `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#dashboards:name=${this.dashboardName}`;
    }
}
exports.Dashboard = Dashboard;
/** @internal */
function getDashboardBody(args, region) {
    const widgets = args.widgets || [];
    if (widgets.length < 0 || widgets.length > 100) {
        throw new Error("Must supply between 0 and 100 widgets.");
    }
    const firstWidgetIsRow = widgets[0] instanceof widgets_flow_1.RowWidget;
    for (let i = 1; i < widgets.length; i++) {
        const currentWidgetIsRow = widgets[i] instanceof widgets_flow_1.RowWidget;
        if (firstWidgetIsRow !== currentWidgetIsRow) {
            throw new Error("All widgets must either be RowWidgets or none of them must be.");
        }
    }
    const rows = firstWidgetIsRow
        ? widgets
        : [new widgets_flow_1.RowWidget(...widgets)];
    const column = new widgets_flow_1.ColumnWidget(...rows);
    const widgetJsons = [];
    column.addWidgetJson(widgetJsons, /*xOffset:*/ 0, /*yOffset:*/ 0, region);
    return pulumi.output({
        start: args.start,
        end: args.end,
        periodOverride: args.periodOverride,
        widgets: widgetJsons,
    });
}
exports.getDashboardBody = getDashboardBody;
//# sourceMappingURL=dashboard.js.map