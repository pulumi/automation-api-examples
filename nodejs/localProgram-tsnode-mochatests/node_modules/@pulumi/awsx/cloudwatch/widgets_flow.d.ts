import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Widget } from "./widget";
import { WidgetJson } from "./widgets_json";
interface WidgetRelativePosition {
    /** x-position of this widget, relative to the x-position of its container. */
    relativeX: number;
    /** y-position of this widget, relative to the y-position of its container. */
    relativeY: number;
}
/**
 * A sequence of widgets flowing either horizontally or vertically.  Widgets flowing horizontally
 * must wrap after 24 grid columns.  There is no effective vertical limit on widgets flowing
 * vertically.
 */
export declare abstract class FlowWidget implements Widget {
    protected readonly widgets: Widget[];
    constructor(...widgets: Widget[]);
    addWidget(widget: Widget): void;
    /**
     * Determines the relative positions of all the child widgets in this [FlowWidget]. 'Relative
     * Position' tells us where the widget should be placed relative to the upper-left point of this
     * FlowWidget.
     */
    protected abstract getWidgetRelativePositions(): Map<Widget, WidgetRelativePosition>;
    width(): number;
    height(): number;
    /** For internal use only. */
    addWidgetJson(widgetJsons: WidgetJson[], xOffset: number, yOffset: number, region: pulumi.Output<aws.Region>): void;
}
/**
 * Represents a vertical sequence of [Widget]s in the [Dashboard].  There is no limit on how long
 * this sequence will be.
 *
 * The final width of this widget will be the width of the largest item in the column. The final
 * height of this widget will be the sum of all the heights of all the widgets in the column.
 */
export declare class ColumnWidget extends FlowWidget {
    constructor(...widgets: Widget[]);
    protected getWidgetRelativePositions(): Map<Widget, WidgetRelativePosition>;
}
/**
 * Represents a horizontal sequence of [Widget]s in the [Dashboard].  Widgets are laid out
 * horizontally in the grid until it would go past the max width of 24 columns.  When that happens,
 * the widgets will wrap to the next available grid row.
 *
 * Rows must start in the leftmost grid column.
 *
 * The final width of this widget will be the furthest column that a widget is placed at prior to
 * wrapping. The final height of this widget will be the bottommost row that a widget is placed at.
 */
export declare class RowWidget extends FlowWidget {
    constructor(...widgets: Widget[]);
    protected getWidgetRelativePositions(): Map<Widget, WidgetRelativePosition>;
    /** For internal use only. */
    addWidgetJson(widgetJsons: WidgetJson[], xOffset: number, yOffset: number, region: pulumi.Output<aws.Region>): void;
}
export {};
