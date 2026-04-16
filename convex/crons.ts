import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Send weekly summary email every Saturday at 8:00 AM UTC
crons.weekly(
  "weekly-summary",
  {
    dayOfWeek: "saturday",
    hourUTC: 8,
    minuteUTC: 0,
  },
  internal.emails.sendWeeklySummary,
  {},
);

export default crons;
