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
/**
 * Creates an appropriate [Cron](https://en.wikipedia.org/wiki/Cron) format string that can be
 * used as the [recurrence] property of [ScheduleArgs].
 */
function cronExpression(a) {
    checkRange(a.minute, "minute", 0, 59);
    checkRange(a.hour, "hour", 0, 23);
    checkRange(a.dayOfMonth, "dayOfMonth", 1, 31);
    return `${val(a.minute)} ${val(a.hour)} ${val(a.dayOfMonth)} ${month(a.month)} ${dayOfWeek(a.dayOfWeek)}`;
    function val(v) {
        return v === undefined ? "*" : v;
    }
    function dayOfWeek(v) {
        if (v === undefined || typeof v === "number") {
            checkRange(v, "dayOfWeek", 0, 7);
            return val(v);
        }
        switch (v) {
            case "Sunday": return 0;
            case "Monday": return 1;
            case "Tuesday": return 2;
            case "Wednesday": return 3;
            case "Thursday": return 4;
            case "Friday": return 5;
            case "Saturday": return 6;
            default: throw new Error(`Invalid day of week: ${v}`);
        }
    }
    function month(v) {
        if (v === undefined || typeof v === "number") {
            checkRange(v, "month", 1, 12);
            return val(v);
        }
        switch (v) {
            case "January": return 1;
            case "February": return 2;
            case "March": return 3;
            case "April": return 4;
            case "May": return 5;
            case "June": return 6;
            case "July": return 7;
            case "August": return 8;
            case "September": return 9;
            case "October": return 10;
            case "November": return 11;
            case "December": return 12;
            default: throw new Error(`Invalid month: ${v}`);
        }
    }
    function checkRange(val, name, minInclusive, maxInclusive) {
        if (val !== undefined) {
            if (val < minInclusive || val > maxInclusive) {
                throw new Error(`Value for [args.${name}] was not in the inclusive range [${minInclusive}, ${maxInclusive}].`);
            }
        }
    }
}
exports.cronExpression = cronExpression;
//# sourceMappingURL=schedule.js.map