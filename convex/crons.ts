import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Send weekly summary email every Saturday at 9:00 AM UK time.
// Convex crons run on UTC only, so this fires at 08:00 UTC and the
// dispatcher delays an hour during winter (GMT) when London is still 8am.
crons.weekly(
  "weekly-summary",
  {
    dayOfWeek: "saturday",
    hourUTC: 8,
    minuteUTC: 0,
  },
  internal.emails.dispatchWeeklySummary,
  {},
);

export default crons;
