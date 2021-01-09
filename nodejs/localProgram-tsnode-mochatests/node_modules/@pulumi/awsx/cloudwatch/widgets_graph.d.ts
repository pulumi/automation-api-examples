import * as pulumi from "@pulumi/pulumi";
import { MetricWidget, MetricWidgetArgs } from "./widgets_simple";
export interface GraphMetricWidgetArgs extends MetricWidgetArgs {
    /**
     * Limits for the minimums and maximums of the y-axis.  This applies to every metric being
     * graphed, unless specific metrics override it.
     */
    yAxis?: pulumi.Input<YAxis>;
}
export interface YAxis {
    /** Optional min and max settings for the left Y-axis.  */
    left?: MinMax;
    /** Optional min and max settings for the right Y-axis. */
    right?: MinMax;
}
export interface MinMax {
    /** The minimum value for this Y-axis */
    min?: number;
    /** The maximum value for this Y-axis */
    max?: number;
}
/**
 * Base type for widets that display metrics as a graph (either a line or stacked graph).
 *
 * See https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph_metrics.html for more
 * details.
 */
export declare abstract class GraphMetricWidget extends MetricWidget {
    private readonly graphArgs;
    constructor(graphArgs: GraphMetricWidgetArgs);
    protected computeView: () => pulumi.Input<"timeSeries" | "singleValue" | undefined>;
    protected computeYAxis: () => YAxis | Promise<YAxis> | pulumi.OutputInstance<YAxis> | undefined;
}
/**
 * Displays a set of metrics as a line graph.
 */
export declare class LineGraphMetricWidget extends GraphMetricWidget {
    constructor(args: GraphMetricWidgetArgs);
    protected computedStacked: () => boolean;
}
/**
 * Displays a set of metrics as a stacked area graph.
 */
export declare class StackedAreaGraphMetricWidget extends GraphMetricWidget {
    constructor(args: GraphMetricWidgetArgs);
    protected computedStacked: () => boolean;
}
/**
 * Displays a set of metrics as a single number.
 */
export declare class SingleNumberMetricWidget extends MetricWidget {
    constructor(args: MetricWidgetArgs);
    protected computedStacked: () => boolean;
    protected computeView: () => pulumi.Input<"timeSeries" | "singleValue" | undefined>;
    protected computeYAxis: () => YAxis | Promise<YAxis> | pulumi.OutputInstance<YAxis> | undefined;
}
