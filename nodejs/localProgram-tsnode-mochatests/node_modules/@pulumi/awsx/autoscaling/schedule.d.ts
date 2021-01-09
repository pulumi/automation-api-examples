import * as pulumi from "@pulumi/pulumi";
/**
 * Creates an appropriate [Cron](https://en.wikipedia.org/wiki/Cron) format string that can be
 * used as the [recurrence] property of [ScheduleArgs].
 */
export declare function cronExpression(a: ScheduleRecurrenceArgs): string;
/**
 * If a number, it must be between 0 to 7 (inclusive).  (0 and 7 both represent Sunday). Leave
 * undefined to indicate no specific value.
 */
export declare type DayOfWeek = number | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
/**
 * If a number, it must be between 1 to 12 (inclusive).  Leave undefined to indicate no specific
 * value.
 */
export declare type Month = number | "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";
export interface ScheduleRecurrenceArgs {
    /** 0 to 59.  Leave undefined to indicate no specific value. */
    minute?: number;
    /** 0 to 23.  Leave undefined to indicate no specific value.  All times UTC */
    hour?: number;
    /** 1 to 31.  Leave undefined to indicate no specific value. */
    dayOfMonth?: number;
    /** Month of the year to perform the scheduled action on.  Leave undefined to indicate no specific value. */
    month?: Month;
    /** Day of the week to perform the scheduled action on.  Leave undefined to indicate no specific value. */
    dayOfWeek?: DayOfWeek;
}
export interface ScheduleArgs {
    /**
     * The name of this scaling action.  If not provided, the name of the requested
     * [aws.autoscaling.Schedule] will be used for this.
     */
    scheduledActionName?: pulumi.Input<string>;
    /**
     * The number of EC2 instances that should be running in the group. Do not pass a value if you don't want to change
     * the size at the scheduled time.
     */
    desiredCapacity?: pulumi.Input<number>;
    /**
     * The time for this action to end, in "YYYY-MM-DDThh:mm:ssZ" format in UTC/GMT only (for
     * example, 2014-06-01T00:00:00Z ). If you try to schedule your action in the past, Auto Scaling
     * returns an error message.
     */
    endTime?: pulumi.Input<string>;
    /**
     * The maximum size for the Auto Scaling group. Do not pass a value if you don't want to change
     * the size at the scheduled time.
     */
    maxSize?: pulumi.Input<number>;
    /**
     * The minimum size for the Auto Scaling group. Do not pass a value if you don't want to change
     * the size at the scheduled time.
     */
    minSize?: pulumi.Input<number>;
    /**
     * The time when recurring future actions will start. Start time is specified by the user
     * following the Unix cron syntax format. [cronExpression] can be used to easily create values
     * of this.
     */
    recurrence?: pulumi.Input<string | ScheduleRecurrenceArgs>;
    /**
     * The time for this action to start, in "YYYY-MM-DDThh:mm:ssZ" format in UTC/GMT only (for
     * example, 2014-06-01T00:00:00Z ). If you try to schedule your action in the past, Auto Scaling
     * returns an error message.
     */
    startTime?: pulumi.Input<string>;
}
