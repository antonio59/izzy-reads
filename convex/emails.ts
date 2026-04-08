import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

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
<body style="margin: 0; padding: 0; background-color: #faf5ff; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📚 New Book Suggestion!</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">Someone has a book idea for you, Izzy!</p>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">

      <!-- Book Info -->
      <div style="margin-bottom: 20px; padding: 16px; background: #faf5ff; border-radius: 12px;">
        <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e293b;">${args.title}</h2>
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">by ${args.author}</p>
        ${args.genre ? `<span style="display: inline-block; padding: 2px 10px; background: #ede9fe; color: #7c3aed; border-radius: 100px; font-size: 12px; font-weight: 600;">${args.genre}</span>` : ""}
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
      <a href="https://izzysbookshelf.com/admin" style="display: block; text-align: center; padding: 14px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
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
      from: "Izzy's Bookshelf <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `📚 Someone suggested "${args.title}" by ${args.author}!`,
      html,
    });
  },
});
