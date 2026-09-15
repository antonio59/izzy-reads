import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api, internal } from "./_generated/api";
import { escapeHtml } from "./validation";

declare const process: { env: Record<string, string | undefined> };

const SITE_URL = "https://izzysbookshelf.com";

// Design tokens mirroring src/index.css
const C = {
  cream: "#f5f1ea",
  card: "#fdfcfa",
  border: "#ede7db",
  ink: "#1a1614",
  body: "#5c564f",
  muted: "#736d65",
  berry: "#d946a8",
  berryDark: "#9d2d77",
  berryLight: "#fce7f3",
  teal: "#0d9488",
  tealLight: "#ccfbf1",
  gold: "#f59e0b",
  goldLight: "#fef3c7",
};
const FONT_DISPLAY = "'Nunito','Arial Rounded MT Bold','Trebuchet MS',sans-serif";
const FONT_BODY = "'Inter','Helvetica Neue',Arial,sans-serif";

const HEAD = `<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap');</style>`;

const card =
  `background:${C.card};border:1px solid ${C.border};border-radius:20px;` +
  `padding:20px 22px;margin:0 0 14px 0;box-shadow:0 3px 0 ${C.border},0 12px 28px rgba(45,41,37,0.07);`;

const sectionTitle = (label: string) =>
  `<h2 style="margin:0 0 12px 0;font-family:${FONT_DISPLAY};font-size:17px;font-weight:800;color:${C.ink};">${label}</h2>`;

function emailShell(opts: {
  heading: string;
  subheading: string;
  preheader?: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  footerNote?: string;
}) {
  return `<!DOCTYPE html>
<html>
<head>${HEAD}</head>
<body style="margin:0;padding:0;background-color:${C.cream};font-family:${FONT_BODY};color:${C.body};">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${opts.preheader}</div>` : ""}
  <div style="max-width:560px;margin:0 auto;padding:32px 16px 24px 16px;">

    <!-- Wordmark -->
    <div style="text-align:center;margin-bottom:20px;">
      <span style="font-family:${FONT_DISPLAY};font-size:15px;font-weight:800;color:${C.berryDark};">📚 Izzy&rsquo;s Bookshelf</span>
    </div>

    <!-- Heading card -->
    <div style="${card}text-align:center;padding:32px 24px;">
      <h1 style="margin:0;font-family:${FONT_DISPLAY};font-size:26px;line-height:1.25;font-weight:900;color:${C.ink};">${opts.heading}</h1>
      <p style="margin:8px 0 0 0;font-size:15px;line-height:1.5;color:${C.muted};">${opts.subheading}</p>
    </div>

    ${opts.body}

    <!-- CTA -->
    <div style="text-align:center;margin:20px 0 6px 0;">
      <a href="${opts.ctaHref}" style="display:inline-block;padding:14px 34px;background:${C.berry};color:#ffffff;text-decoration:none;border-radius:999px;font-family:${FONT_DISPLAY};font-weight:800;font-size:16px;box-shadow:0 4px 0 ${C.berryDark};">${opts.ctaLabel}</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:18px 16px 8px 16px;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:${C.muted};">${opts.footerNote ?? `Sent with love from <a href="${SITE_URL}" style="color:${C.teal};text-decoration:none;">izzysbookshelf.com</a> ✨`}</p>
    </div>
  </div>
</body>
</html>`;
}

const pill = (label: string, count: number, bg: string, fg: string) =>
  `<span style="display:inline-block;padding:6px 12px;background:${bg};color:${fg};border-radius:999px;font-size:13px;font-weight:600;">${label}: ${count}</span>`;

// Send notification email when a book is suggested
export const sendSuggestionNotification = internalAction({
  args: {
    title: v.string(),
    author: v.string(),
    suggestedBy: v.string(),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
    to: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping email notification");
      return;
    }

    // Suggestion notifications are for the parent/admin; fall back to the
    // general notification address if no dedicated one is configured.
    const adminEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL;
    if (!adminEmail && !args.to) {
      console.warn("No notification email configured — skipping email");
      return;
    }

    const resend = new Resend(apiKey);

    const html = emailShell({
      heading: "Someone suggested a book 📖",
      subheading: `A new idea for Izzy&rsquo;s shelf just came in.`,
      ctaLabel: "Review suggestion",
      ctaHref: `${SITE_URL}/admin`,
      preheader: `${args.suggestedBy.slice(0, 60)} suggested "${args.title.slice(0, 80)}" for Izzy's shelf`,
      body: `
    <!-- Book Info -->
    <div style="${card}border-left:6px solid ${C.berry};">
      <h2 style="margin:0 0 4px 0;font-family:${FONT_DISPLAY};font-size:19px;font-weight:800;color:${C.ink};">${escapeHtml(args.title)}</h2>
      <p style="margin:0 0 10px 0;font-size:14px;color:${C.muted};">by ${escapeHtml(args.author)}</p>
      ${args.genre ? `<span style="display:inline-block;padding:3px 12px;background:${C.berryLight};color:${C.berryDark};border-radius:999px;font-size:12px;font-weight:700;">${escapeHtml(args.genre)}</span>` : ""}
    </div>

    <!-- Who Suggested -->
    <div style="${card}">
      ${sectionTitle("Suggested by")}
      <p style="margin:0;font-size:16px;font-weight:700;color:${C.ink};">${escapeHtml(args.suggestedBy)}</p>
      ${args.reason ? `<p style="margin:10px 0 0 0;font-size:14px;color:${C.body};font-style:italic;line-height:1.6;">&ldquo;${escapeHtml(args.reason)}&rdquo;</p>` : ""}
    </div>`,
      footerNote: `This one&rsquo;s for the grown-ups — review it in the <a href="${SITE_URL}/admin" style="color:${C.teal};text-decoration:none;">admin dashboard</a>.`,
    });

    await resend.emails.send({
      from: "Izzy's Bookshelf <suggestions@izzysbookshelf.com>",
      to: args.to ?? adminEmail!,
      subject: `📚 Someone suggested "${args.title.slice(0, 100)}" by ${args.author.slice(0, 100)}!`,
      html,
      text: [
        `New book suggestion for Izzy's shelf:`,
        `${args.title} by ${args.author}${args.genre ? ` (${args.genre})` : ""}`,
        `Suggested by: ${args.suggestedBy}`,
        args.reason ? `Why: "${args.reason}"` : null,
        "",
        `Review it: ${SITE_URL}/admin`,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  },
});

// Send weekly summary email on Saturday mornings
export const sendWeeklySummary = internalAction({
  args: {
    to: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping weekly summary");
      return;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail && !args.to) {
      console.warn("NOTIFICATION_EMAIL not set — skipping weekly summary");
      return;
    }

    const resend = new Resend(apiKey);

    // Gather stats
    const bookStats = await ctx.runQuery(internal.reactions.getAllBookReactionStatsInternal);
    const reviewStats = await ctx.runQuery(internal.reactions.getAllReviewReactionStatsInternal);
    const poemStats = await ctx.runQuery(internal.poemReactions.getAllPoemReactionStatsInternal);
    const writingStats = await ctx.runQuery(internal.writingReactions.getAllWritingReactionStats);

    const books = await ctx.runQuery(api.books.getAll);
    const wishlist = await ctx.runQuery(api.wishlist.getAll);
    const poems = await ctx.runQuery(api.poems.getAll);
    const blogPosts = await ctx.runQuery(api.blogPosts.getAll);
    const readBooks = books.filter((b) => b.isRead);
    const totalReviews = readBooks.filter((b) => b.notes).length;

    // This week's activity (last 7 days, by record creation / dateRead)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const booksAddedThisWeek = books.filter((b) => b._creationTime >= weekAgo);
    const booksReadThisWeek = readBooks.filter((b) => {
      if (!b.dateRead) return false;
      const t = new Date(b.dateRead).getTime();
      return !Number.isNaN(t) && t >= weekAgo;
    });
    const wishlistAddedThisWeek = wishlist.filter(
      (w) => w._creationTime >= weekAgo,
    );
    const poemsThisWeek = poems.filter((p) => p._creationTime >= weekAgo);
    const postsThisWeek = blogPosts.filter(
      (p) => p._creationTime >= weekAgo && p.status === "published",
    );

    // Most recent review (has notes; prefer dateRead, fall back to creation)
    const lastReview = readBooks
      .filter((b) => b.notes)
      .sort((a, b) => {
        const ta = a.dateRead ? new Date(a.dateRead).getTime() : a._creationTime;
        const tb = b.dateRead ? new Date(b.dateRead).getTime() : b._creationTime;
        return (Number.isNaN(tb) ? b._creationTime : tb) -
          (Number.isNaN(ta) ? a._creationTime : ta);
      })[0];

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

    const statTile = (num: string, label: string, color: string) =>
      `<td style="text-align:center;padding:10px 4px;"><div style="font-family:${FONT_DISPLAY};font-size:26px;font-weight:900;color:${color};line-height:1;">${num}</div><div style="font-size:12px;color:${C.muted};margin-top:5px;">${label}</div></td>`;

    const stars = (rating?: number) =>
      rating
        ? `<span style="color:${C.gold};font-size:15px;letter-spacing:1px;">${"★".repeat(Math.min(5, Math.round(rating)))}${"☆".repeat(Math.max(0, 5 - Math.min(5, Math.round(rating))))}</span>`
        : "";

    const preheader = [
      booksReadThisWeek.length > 0
        ? `${booksReadThisWeek.length} book${booksReadThisWeek.length === 1 ? "" : "s"} finished`
        : null,
      totalReactions > 0 ? `${totalReactions} reaction${totalReactions === 1 ? "" : "s"}` : null,
      milestones.length > 0 ? "a milestone hit" : null,
    ]
      .filter(Boolean)
      .join(", ") || "See what happened on your bookshelf this week";

    const html = emailShell({
      heading: "Hi Izzy! Here&rsquo;s your week in books",
      subheading: "Everything that happened on your bookshelf this week.",
      preheader,
      ctaLabel: "Visit your bookshelf",
      ctaHref: SITE_URL,
      body: `
    <!-- Finished this week -->
    ${booksReadThisWeek.length > 0 ? `
    <div style="${card}border-left:6px solid ${C.teal};">
      ${sectionTitle("You finished")}
      <ul style="margin:0;padding-left:20px;color:${C.body};font-size:14px;line-height:1.7;">
        ${booksReadThisWeek.map((b) => `<li style="margin-bottom:4px;"><strong style="color:${C.ink};">${escapeHtml(b.title)}</strong> by ${escapeHtml(b.author)}${b.rating ? ` — <span style="color:${C.gold};">${"★".repeat(Math.min(5, Math.round(b.rating)))}</span>` : ""}</li>`).join("")}
      </ul>
    </div>` : ""}

    <!-- Newly added books + wishlist -->
    ${booksAddedThisWeek.length + wishlistAddedThisWeek.length > 0 ? `
    <div style="${card}border-left:6px solid ${C.berry};">
      ${sectionTitle("New this week")}
      ${booksAddedThisWeek.length > 0 ? `<p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:${C.body};"><strong style="color:${C.ink};">${booksAddedThisWeek.length}</strong> added to your shelf: ${booksAddedThisWeek.slice(0, 5).map((b) => escapeHtml(b.title)).join(", ")}${booksAddedThisWeek.length > 5 ? ` +${booksAddedThisWeek.length - 5} more` : ""}</p>` : ""}
      ${wishlistAddedThisWeek.length > 0 ? `<p style="margin:0;font-size:14px;line-height:1.6;color:${C.body};"><strong style="color:${C.ink};">${wishlistAddedThisWeek.length}</strong> on your wishlist: ${wishlistAddedThisWeek.slice(0, 5).map((w) => escapeHtml(w.title)).join(", ")}${wishlistAddedThisWeek.length > 5 ? ` +${wishlistAddedThisWeek.length - 5} more` : ""}</p>` : ""}
    </div>` : ""}

    <!-- Your latest review -->
    ${lastReview ? `
    <div style="${card}border-left:6px solid ${C.gold};">
      ${sectionTitle("Your latest review")}
      <p style="margin:0 0 6px 0;font-size:15px;line-height:1.5;color:${C.body};"><strong style="color:${C.ink};font-family:${FONT_DISPLAY};">${escapeHtml(lastReview.title)}</strong> by ${escapeHtml(lastReview.author)} ${stars(lastReview.rating)}</p>
      <p style="margin:0;font-size:14px;color:${C.body};font-style:italic;line-height:1.6;">&ldquo;${escapeHtml(lastReview.notes!.length > 160 ? lastReview.notes!.slice(0, 160).trimEnd() + "…" : lastReview.notes!)}&rdquo;</p>
    </div>` : ""}

    <!-- Reactions -->
    <div style="${card}">
      ${sectionTitle("Reactions to your shelf")}
      <div>
        ${pill("📚 Books", bookStats.totalReactions, C.berryLight, C.berryDark)}
        ${pill("📝 Reviews", reviewStats?.totalReactions || 0, C.tealLight, "#0f5e57")}
        ${pill("✍️ Poems", poemStats.totalReactions, C.goldLight, "#8a5a00")}
        ${pill("📖 Writing", writingStats.totalReactions, C.berryLight, C.berryDark)}
      </div>
      ${totalReactions > 0 ? `<p style="margin:12px 0 0 0;font-size:14px;color:${C.body};"><strong style="color:${C.ink};">${totalReactions}</strong> reactions this week — nice! 🎉</p>` : ""}
    </div>

    <!-- Milestones -->
    ${milestones.length > 0 ? `
    <div style="${card}background:${C.goldLight};border-left:6px solid ${C.gold};">
      ${sectionTitle("🏆 Milestones")}
      <ul style="margin:0;padding-left:20px;color:${C.body};font-size:14px;line-height:1.7;">
        ${milestones.map((m) => `<li style="margin-bottom:4px;">${m}</li>`).join("")}
      </ul>
    </div>` : ""}

    <!-- Stats -->
    <div style="${card}">
      ${sectionTitle("Your bookshelf so far")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        ${statTile(String(readBooks.length), "books read", C.berry)}
        ${statTile(String(totalReviews), "reviews", C.teal)}
        ${statTile(totalPages.toLocaleString(), "pages", C.gold)}
      </tr></table>
    </div>

    <!-- Keep it going -->
    <div style="${card}border-left:6px solid ${C.teal};">
      ${sectionTitle("Keep it going")}
      <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:${C.body};">Read anything this week? <a href="${SITE_URL}/books" style="color:${C.teal};text-decoration:none;font-weight:600;">Pop it on your shelf</a> — every book counts, even the ones you don&rsquo;t review.</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${C.body};">${(() => {
        const parts: string[] = [];
        if (poemsThisWeek.length > 0) parts.push(`${poemsThisWeek.length} poem${poemsThisWeek.length === 1 ? "" : "s"}`);
        if (postsThisWeek.length > 0) parts.push(`${postsThisWeek.length} post${postsThisWeek.length === 1 ? "" : "s"}`);
        return parts.length > 0
          ? `You shared ${parts.join(" and ")} this week — lovely! Got another brewing? `
          : "Written a poem, story, or review lately? ";
      })()}<a href="${SITE_URL}/create" style="color:${C.teal};text-decoration:none;font-weight:600;">Share it</a> — your readers are waiting.</p>
    </div>`,
    });

    const text = [
      "Hi Izzy! Here's your week in books.",
      "",
      booksReadThisWeek.length > 0
        ? `You finished: ${booksReadThisWeek.map((b) => `${b.title} by ${b.author}`).join("; ")}`
        : null,
      booksAddedThisWeek.length > 0
        ? `Added to your shelf: ${booksAddedThisWeek.map((b) => b.title).join(", ")}`
        : null,
      wishlistAddedThisWeek.length > 0
        ? `On your wishlist: ${wishlistAddedThisWeek.map((w) => w.title).join(", ")}`
        : null,
      lastReview
        ? `Your latest review: ${lastReview.title} — "${lastReview.notes}"`
        : null,
      `Reactions this week: ${totalReactions} (books ${bookStats.totalReactions}, reviews ${reviewStats?.totalReactions || 0}, poems ${poemStats.totalReactions}, writing ${writingStats.totalReactions})`,
      milestones.length > 0 ? `Milestones: ${milestones.join(", ")}` : null,
      `Bookshelf so far: ${readBooks.length} books read, ${totalReviews} reviews, ${totalPages.toLocaleString()} pages.`,
      "",
      "Keep it going — log every book you read, and share poems, stories, and reviews:",
      `${SITE_URL}/books  |  ${SITE_URL}/create`,
      "",
      `Visit your bookshelf: ${SITE_URL}`,
      "",
      "Sent with love from izzysbookshelf.com",
    ]
      .filter((l) => l !== null)
      .join("\n");

    await resend.emails.send({
      from: "Izzy's Bookshelf <summary@izzysbookshelf.com>",
      to: args.to ?? notificationEmail!,
      subject: `✨ Your week on Izzy's Bookshelf`,
      html,
      text,
    });
  },
});
