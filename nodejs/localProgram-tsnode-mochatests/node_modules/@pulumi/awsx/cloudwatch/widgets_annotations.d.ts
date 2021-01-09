import * as pulumi from "@pulumi/pulumi";
import * as wjson from "./widgets_json";
/**
 * Base interface for values that can be placed inside [MetricWidgetArgs.annotations]. Instances of
 * this interface include [aws.cloudwatch.Alarm], [AlarmAnnotation], [HorizontalAnnotation] and
 * [VerticalAnnotation].
 */
export interface WidgetAnnotation {
    /** For internal use only. Only intended to be called by [MetricWidget]. */
    addWidgetJson(annotations: wjson.MetricWidgetAnnotationsJson): void;
}
/**
 * Adds an alarm annotation to a [MetricWidget], allowing a metric alarm to be displayed in a
 * Dashboard.
 */
export declare class AlarmAnnotation implements WidgetAnnotation {
    private readonly alarmArn;
    constructor(alarmArn: pulumi.Input<string>);
    /** For internal use only. */
    addWidgetJson(annotations: wjson.MetricWidgetAnnotationsJson): void;
}
export interface HorizontalAlarmAnnotationArgs {
    alarmDescription: pulumi.Input<string | undefined>;
    threshold: pulumi.Input<number | undefined>;
}
export interface HorizontalAnnotationArgs {
    /**
     * The metric value in the graph where the horizontal annotation line is to appear.  If
     * [belowEdge] is also provided, then this will produce a band annotation.  In that case [fill]
     * should not be provided.
     */
    aboveEdge: HorizontalEdge;
    /**
     * The lower edge when using band shading.
     */
    belowEdge?: HorizontalEdge;
    /**
     * The six-digit HTML hex color code to be used for the annotation. This color is used for both
     * the annotation line and the fill shading.
     */
    color?: string;
    /**
     * How to use fill shading with the annotation. Valid values are above for shading above the
     * annotation, below for shading below the annotation. If fill is omitted, there is no shading.
     *
     * The exception is an annotation with band shading (in which case [lowerEdge] is provided).
     * These annotations always have shading between the two values, and any value for fill is
     * ignored.
     */
    fill?: "above" | "below";
    /**
     * Set this to true to have the annotation appear in the graph, or false to have it be hidden.
     * The default is true.
     */
    visible?: boolean;
    /**
     * If the graph includes multiple metrics, specifies whether the numbers in Value refer to the
     * metric associated with the left Y-axis or the right Y-axis, . Valid values are right and
     * left.
     */
    yAxis?: "left" | "right";
}
export interface HorizontalEdge {
    /**
     * The metric value in the graph where the horizontal annotation line is to appear. On a band
     * shading annotation, the two values for Value define the upper and lower edges of the band.
     *
     * On a graph with horizontal annotations, the graph is scaled so that all visible horizontal
     * annotations appear on the graph.
     */
    value: pulumi.Input<number>;
    /**
     * A string that appears on the graph next to the annotation.
     */
    label?: pulumi.Input<string | undefined>;
}
/**
 * Horizontal annotations have several options for fill shading, including shading above the
 * annotation line, shading below the annotation line, and "band" shading that appears between two
 * linked annotation lines as part of a single band annotation
 */
export declare class HorizontalAnnotation implements WidgetAnnotation {
    private readonly args;
    constructor(args: HorizontalAnnotationArgs);
    constructor(args: HorizontalAlarmAnnotationArgs);
    /** For internal use only. */
    addWidgetJson(annotations: wjson.MetricWidgetAnnotationsJson): void;
}
/**
 * For each vertical annotation, you can choose to have fill shading before the annotation, after
 * it, or between two vertical lines that are linked as a single band annotation.
 */
export interface VerticalAnnotationArgs {
    /**
     * The metric value in the graph where the vertical annotation line is to appear.  If
     * [endEdge] is also provided, then this will produce a band annotation.  In that case [fill]
     * should not be provided.
     */
    beforeEdge: VerticalEdge;
    /**
     * The ending edge when using band shading.
     */
    afterEdge?: VerticalEdge;
    /**
     * The six-digit HTML hex color code to be used for the annotation. This color is used for both
     * the annotation line and the fill shading.
     */
    color?: string;
    /**
     * How to use fill shading with the annotation. Valid values are before for shading before the
     * annotation, after for shading after the annotation. If fill is omitted, there is no shading.
     *
     * The exception is an annotation with band shading. These annotations always have shading
     * between the two values, and any value for [fill] is ignored.
     */
    fill?: "before" | "after";
    /**
     * Set this to true to have the annotation appear in the graph, or false to have it be hidden.
     * The default is true.
     */
    visible?: boolean;
}
export interface VerticalEdge {
    /**
     * The date and time in the graph where the vertical annotation line is to appear. On a band
     * shading annotation, the two values for Value define the beginning and ending edges of the
     * band.
     *
     * On a graph with vertical annotations, the graph is scaled so that all visible vertical
     * annotations appear on the graph.
     *
     * This is defined as a string in ISO 8601 format. For more information, see ISO 8601.
     */
    value: string;
    /**
     * A string that appears on the graph next to the annotation.
     */
    label?: string;
}
/**
 * Vertical annotations have several options for fill shading, including shading before the
 * annotation line, shading after the annotation line, and "band" shading that appears between two
 * linked annotation lines as part of a single band annotation
 */
export declare class VerticalAnnotation implements WidgetAnnotation {
    private readonly args;
    constructor(args: VerticalAnnotationArgs);
    /** For internal use only. */
    addWidgetJson(annotations: wjson.MetricWidgetAnnotationsJson): void;
}
