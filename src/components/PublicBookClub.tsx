import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, Calendar, MessageCircle, Send, X, Clock } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

const CLUB_REACTIONS = [
  { key: "excited", emoji: "🤩", label: "Excited!" },
  { key: "reading", emoji: "📖", label: "Reading it" },
  { key: "finished", emoji: "✅", label: "Finished!" },
  { key: "love", emoji: "❤️", label: "Loved it" },
] as const;

export default function PublicBookClub() {
  const clubData = useQuery(api.bookClubs.getActive);
  const [visitorName, setVisitorName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<"comment" | { reaction: typeof CLUB_REACTIONS[number]["key"] } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addComment = useMutation(api.bookClubs.addComment);
  const addReaction = useMutation(api.bookClubs.addReaction);
  const visitorReaction = useQuery(
    api.bookClubs.getVisitorReaction,
    clubData && visitorName && passcode.length === 6
      ? { clubId: clubData._id, visitorName, passcode }
      : "skip",
  );

  // Load saved credentials
  useEffect(() => {
    const savedName = localStorage.getItem("izzy_bookclub_name");
    const savedPasscode = localStorage.getItem("izzy_bookclub_passcode");
    if (savedName) setVisitorName(savedName);
    if (savedPasscode) setPasscode(savedPasscode);
  }, []);

  const saveCredentials = () => {
    localStorage.setItem("izzy_bookclub_name", visitorName.trim());
    localStorage.setItem("izzy_bookclub_passcode", passcode);
  };

  const handleOpenComment = () => {
    if (!visitorName.trim() || passcode.length !== 6) {
      setShowNamePrompt(true);
      setPendingAction("comment");
      return;
    }
    setPendingAction("comment");
  };

  const handleReaction = (reactionKey: typeof CLUB_REACTIONS[number]["key"]) => {
    if (!visitorName.trim() || passcode.length !== 6) {
      setShowNamePrompt(true);
      setPendingAction({ reaction: reactionKey });
      return;
    }
    submitReaction(reactionKey);
  };

  const submitComment = async () => {
    if (!clubData) return;
    if (!commentText.trim()) {
      setError("Please write a comment");
      return;
    }
    try {
      await addComment({
        clubId: clubData._id,
        visitorName: visitorName.trim(),
        passcode,
        content: commentText.trim(),
      });
      saveCredentials();
      setCommentText("");
      setPendingAction(null);
      setSuccess("Comment posted!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post comment");
    }
  };

  const submitReaction = async (reactionKey: typeof CLUB_REACTIONS[number]["key"]) => {
    if (!clubData) return;
    try {
      await addReaction({
        clubId: clubData._id,
        visitorName: visitorName.trim(),
        passcode,
        reactionType: reactionKey,
      });
      saveCredentials();
      setSuccess("Reaction added!");
      setTimeout(() => setSuccess(""), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add reaction");
    }
  };

  const handlePromptSubmit = () => {
    if (!visitorName.trim() || passcode.length !== 6) {
      setError("Please enter your name and a 6-digit passcode");
      return;
    }
    setError("");
    saveCredentials();
    setShowNamePrompt(false);
    if (pendingAction === "comment") {
      // Keep comment form open
    } else if (pendingAction && "reaction" in pendingAction) {
      submitReaction(pendingAction.reaction);
    }
  };

  const isPromptOpen = showNamePrompt || (pendingAction === "comment" && (!visitorName.trim() || passcode.length !== 6));

  if (!clubData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">No Active Book Club</h1>
            <p className="text-stone-500">Check back soon for Izzy's next book club pick!</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const detailedData = useQuery(
    api.bookClubs.getById,
    { id: clubData._id },
  );

  const daysLeft = Math.max(0, Math.ceil((new Date(clubData.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50 flex flex-col">
      <PublicNav />

      {/* Hero */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-stone-800">
                Izzy's Book Club
              </h1>
              <p className="text-sm text-stone-500">Read along with friends!</p>
            </div>
          </motion.div>

          {/* Book Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-cream-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Cover */}
              <div className="md:w-48 lg:w-56 flex-shrink-0 bg-gradient-to-br from-cream-100 to-cream-200 p-6 flex items-center justify-center">
                {clubData.coverUrl ? (
                  <img
                    src={clubData.coverUrl}
                    alt={clubData.title}
                    className="w-32 md:w-full rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="w-32 h-48 rounded-lg bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center shadow-xl">
                    <BookOpen className="w-12 h-12 text-white/70" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    Active Pick
                  </span>
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="w-3 h-3" />
                    {daysLeft > 0 ? `${daysLeft} days left` : "Ending today"}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">
                  {clubData.title}
                </h2>
                <p className="text-stone-500 text-lg mb-4">by {clubData.author}</p>

                {clubData.description && (
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {clubData.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                  <Calendar className="w-4 h-4" />
                  Discussion open until{" "}
                  {new Date(clubData.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Reactions */}
                {detailedData && (
                  <div className="flex flex-wrap gap-2">
                    {CLUB_REACTIONS.map((r) => {
                      const count = detailedData.reactionCounts[r.key] || 0;
                      const isActive = visitorReaction === r.key;
                      return (
                        <motion.button
                          key={r.key}
                          onClick={() => handleReaction(r.key)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            isActive
                              ? "bg-primary-500 text-white ring-2 ring-primary-300"
                              : "bg-cream-100 text-stone-600 hover:bg-cream-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{r.emoji}</span>
                          <span className="hidden sm:inline">{r.label}</span>
                          {count > 0 && (
                            <span className={`ml-1 text-xs ${isActive ? "text-white/80" : "text-stone-400"}`}>
                              {count}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discussion */}
      <section className="flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-500" />
              Discussion
            </h3>
            <span className="text-sm text-stone-500">
              {detailedData?.comments.length || 0} comment
              {(detailedData?.comments.length || 0) !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Comments list */}
          <div className="space-y-4 mb-8">
            {detailedData?.comments.length ? (
              detailedData.comments.map((comment, idx) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-800">{comment.visitorName}</span>
                    <span className="text-xs text-stone-400">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{comment.content}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-cream-300">
                <p className="text-stone-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Comment input */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-cream-300">
            {pendingAction === "comment" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-stone-700">Add a comment</p>
                  <button
                    onClick={() => setPendingAction(null)}
                    className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-stone-400" />
                  </button>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What do you think about this book?"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none text-stone-700"
                  rows={4}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <motion.button
                  onClick={submitComment}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={handleOpenComment}
                className="w-full flex items-center gap-3 px-4 py-3 bg-cream-50 hover:bg-cream-100 rounded-xl text-stone-600 font-medium transition-colors text-left"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary-500" />
                </div>
                <span>Join the discussion...</span>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Name/Passcode Prompt Modal */}
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNamePrompt(false)} />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-bold text-stone-800 mb-2">Join the Discussion</h3>
              <p className="text-sm text-stone-500 mb-4">
                Enter a name and create a 6-digit passcode so we know it's you next time.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit passcode"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowNamePrompt(false)}
                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePromptSubmit}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg text-sm font-medium"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
}
