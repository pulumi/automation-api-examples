import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Widget } from "./widget";
export interface DashboardArgs {
    /**
     * The name of the dashboard.
     */
    name?: pulumi.Input<string>;
    /**
     * The region that widgets can say they're associated with.  If not provided, the region will be
     * inferred by whatever provider the [Dashboard] ends up using.
     */
    region?: pulumi.Input<aws.Region>;
    /**
     * The end of the time range to use for each widget on the dashboard when the dashboard loads.
     * If you specify a value for end, you must also specify a value for start. For each of these
     * values, specify an absolute time in the ISO 8601 format. For example,
     * 2018-12-17T06:00:00.000Z.
     */
    end?: pulumi.Input<string>;
    /**
     * The start of the time range to use for each widget on the dashboard.
     *
     * You can specify start without specifying end to specify a relative time range that ends with
     * the current time. In this case, the value of start must begin with -P, and you can use M, H,
     * D, W and M as abbreviations for minutes, hours, days, weeks and months. For example, -PT8H
     * shows the last 8 hours and -P3M shows the last three months.
     *
     * You can also use start along with an end field, to specify an absolute time range. When
     * specifying an absolute time range, use the ISO 8601 format. For example,
     * 2018-12-17T06:00:00.000Z.
     *
     * If you omit start, the dashboard shows the default time range when it loads.
    */
    start?: pulumi.Input<string>;
    /**
     * Use this field to specify the period for the graphs when the dashboard loads. Specifying auto
     * causes the period of all graphs on the dashboard to automatically adapt to the time range of
     * the dashboard. Specifying inherit ensures that the period set for each graph is always
     * obeyed.
     */
    periodOverride?: pulumi.Input<"auto" | "inherit">;
    /**
     * Widgets to initially add to the [DashboardDescription].  If any of these are [RowWidgets]
     * this will be treated as a sequence of rows.  If not, then this will be treated as a sequence
     * of widgets to make a single row out of.
     */
    widgets?: Widget[];
}
/**
 * [Dashboard]s are represented by a grid of columns 24 wide, with an unlimited number of rows.
 *
 * Each [Widget] in the [Dashboard] have a specific width/height in terms of grid units.
 *
 * A [Dashboard] can include up to 100 widgets.  See
 * https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html#CloudWatch-Dashboard-Properties-Rendering-Object-Format
 * for more details.
 */
export declare class Dashboard extends aws.cloudwatch.Dashboard {
    /**
     * The url this [Dashboard] is published at.
     */
    readonly url: pulumi.Output<string>;
    /**
     * Constructs a [DashboardGrid] out of [Widget]s.  If any of these Widgets are [RowWidget]s.
     * then these will be treated as a sequence of rows to add to the grid.  Otherwise, this will
     * be treated as a single row to add to the grid.
     */
    constructor(name: string, args: DashboardArgs, opts?: pulumi.CustomResourceOptions);
}
