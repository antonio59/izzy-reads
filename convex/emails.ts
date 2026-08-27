import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

// Send notification email when a book is suggested
export const sendSuggestionNotification = internalAction({
  args: {
    title: v.string(),
    author: v.string(),
    suggestedBy: v.string(),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping email notification");
      return;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      console.warn("NOTIFICATION_EMAIL not set — skipping email notification");
      return;
    }

    const resend = new Resend(apiKey);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #d946a8, #0d9488); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📚 New Book Suggestion!</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Someone has a book idea for you, Izzy!</p>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">

      <!-- Book Info -->
      <div style="margin-bottom: 20px; padding: 16px; background: #fdf2f8; border-radius: 12px;">
        <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e293b;">${args.title}</h2>
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">by ${args.author}</p>
        ${args.genre ? `<span style="display: inline-block; padding: 2px 10px; background: #fce7f3; color: #be3590; border-radius: 100px; font-size: 12px; font-weight: 600;">${args.genre}</span>` : ""}
      </div>

      <!-- Who Suggested -->
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Suggested by</p>
        <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${args.suggestedBy}</p>
      </div>

      ${args.reason ? `
      <!-- Why -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Why this book?</p>
        <p style="margin: 0; font-size: 14px; color: #475569; font-style: italic; line-height: 1.5;">"${args.reason}"</p>
      </div>
      ` : ""}

      <!-- CTA -->
      <a href="https://izzysbookshelf.com/admin" style="display: block; text-align: center; padding: 14px; background: linear-gradient(135deg, #d946a8, #0d9488); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
        View in Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">From Izzy's Bookshelf ✨</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Izzy's Bookshelf <suggestions@izzysbookshelf.com>",
      to: notificationEmail,
      subject: `📚 Someone suggested "${args.title}" by ${args.author}!`,
      html,
    });
  },
});

// Send weekly summary email on Saturday mornings
export const sendWeeklySummary = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping weekly summary");
      return;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      console.warn("NOTIFICATION_EMAIL not set — skipping weekly summary");
      return;
    }

    const resend = new Resend(apiKey);

    // Gather stats
    const bookStats = await ctx.runQuery(api.reactions.getAllBookReactionStats);
    const reviewStats = await ctx.runQuery(api.reactions.getAllReviewReactionStats);
    const poemStats = await ctx.runQuery(api.poemReactions.getAllPoemReactionStats);
    const writingStats = await ctx.runQuery(api.writingReactions.getAllWritingReactionStats);

    const books = await ctx.runQuery(api.books.getAll);
    const readBooks = books.filter((b) => b.isRead);
    const totalReviews = readBooks.filter((b) => b.notes).length;

    // Calculate milestones
    const milestones: string[] = [];
    if (readBooks.length >= 10 && readBooks.length % 10 === 0) {
      milestones.push(`🎉 ${readBooks.length} books read!`);
    }
    if (totalReviews >= 5 && totalReviews % 5 === 0) {
      milestones.push(`⭐ ${totalReviews} reviews written!`);
    }
    const totalPages = readBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0);
    if (totalPages >= 1000 && totalPages % 1000 < 100) {
      milestones.push(`📖 ${totalPages.toLocaleString()} pages read!`);
    }

    const totalReactions =
      bookStats.totalReactions +
      (reviewStats?.totalReactions || 0) +
      poemStats.totalReactions +
      writingStats.totalReactions;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #d946a8, #0d9488); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">✨ Weekly Summary</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Here's what happened on Izzy's Bookshelf this week</p>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">

      <!-- Reactions -->
      <div style="margin-bottom: 24px; padding: 16px; background: #fdf2f8; border-radius: 12px;">
        <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">💖 New Reactions</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <span style="display: inline-block; padding: 6px 12px; background: #fce7f3; color: #be3590; border-radius: 100px; font-size: 13px; font-weight: 600;">📚 Books: ${bookStats.totalReactions}</span>
          <span style="display: inline-block; padding: 6px 12px; background: #fce7f3; color: #be3590; border-radius: 100px; font-size: 13px; font-weight: 600;">📝 Reviews: ${reviewStats?.totalReactions || 0}</span>
          <span style="display: inline-block; padding: 6px 12px; background: #fce7f3; color: #be3590; border-radius: 100px; font-size: 13px; font-weight: 600;">✍️ Poems: ${poemStats.totalReactions}</span>
          <span style="display: inline-block; padding: 6px 12px; background: #fce7f3; color: #be3590; border-radius: 100px; font-size: 13px; font-weight: 600;">📖 Writing: ${writingStats.totalReactions}</span>
        </div>
        ${totalReactions > 0 ? `<p style="margin: 12px 0 0 0; font-size: 14px; color: #475569;"><strong>${totalReactions}</strong> total reactions this week! 🎉</p>` : ""}
      </div>

      <!-- Milestones -->
      ${milestones.length > 0 ? `
      <div style="margin-bottom: 24px; padding: 16px; background: #fef3c7; border-radius: 12px;">
        <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">🏆 Milestones Hit</h2>
        <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
          ${milestones.map((m) => `<li style="margin-bottom: 4px;">${m}</li>`).join("")}
        </ul>
      </div>
      ` : ""}

      <!-- Stats -->
      <div style="margin-bottom: 24px; padding: 16px; background: #f0fdf4; border-radius: 12px;">
        <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">📊 Current Stats</h2>
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;"><strong>${readBooks.length}</strong> books read</p>
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;"><strong>${totalReviews}</strong> reviews written</p>
        <p style="margin: 0; font-size: 14px; color: #475569;"><strong>${totalPages.toLocaleString()}</strong> pages read</p>
      </div>

      <!-- Reminder -->
      <div style="padding: 16px; background: #eff6ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 600;">💡 Reminder</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569;">Don't forget to add <em>all</em> the books you've read — not just the ones you want to review!</p>
      </div>

      <!-- CTA -->
      <a href="https://izzysbookshelf.com/admin" style="display: block; text-align: center; margin-top: 24px; padding: 14px; background: linear-gradient(135deg, #d946a8, #0d9488); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
        Open Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">From Izzy's Bookshelf ✨</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Izzy's Bookshelf <summary@izzysbookshelf.com>",
      to: notificationEmail,
      subject: `✨ Your Weekly Summary from Izzy's Bookshelf`,
      html,
    });
  },
});
