import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, Calendar, Clock } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { formatDate } from "../i18n/format";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

const CLUB_REACTIONS = [
  { key: "excited", emoji: "🤩" },
  { key: "reading", emoji: "📖" },
  { key: "finished", emoji: "✅" },
  { key: "love", emoji: "❤️" },
] as const;

export default function PublicBookClub() {
  const clubData = useQuery(api.bookClubs.getActive);
  const { t, i18n } = useTranslation();
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem("izzy_bookclub_name") || "");
  const [passcode, setPasscode] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<typeof CLUB_REACTIONS[number]["key"] | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addReaction = useMutation(api.bookClubs.addReaction);
  const visitorReaction = useQuery(
    api.bookClubs.getVisitorReaction,
    clubData && visitorName && passcode.length === 6
      ? { clubId: clubData._id, visitorName, passcode }
      : "skip",
  );

  const detailedData = useQuery(
    api.bookClubs.getById,
    clubData ? { id: clubData._id } : "skip",
  );

  const endDate = clubData?.endDate;
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const saveCredentials = () => {
    localStorage.setItem("izzy_bookclub_name", visitorName.trim());
    // Passcode is intentionally NOT stored in localStorage
  };

  const handleReaction = (reactionKey: typeof CLUB_REACTIONS[number]["key"]) => {
    if (!visitorName.trim() || passcode.length !== 6) {
      setPendingReaction(reactionKey);
      setShowNamePrompt(true);
      return;
    }
    submitReaction(reactionKey);
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
      setSuccess(t("bookClub.reactionAdded"));
      setTimeout(() => setSuccess(""), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("bookClub.reactionFailed"));
    }
  };

  const handlePromptSubmit = () => {
    if (!visitorName.trim() || passcode.length !== 6) {
      setError(t("bookClub.needNameAndCode"));
      return;
    }
    setError("");
    saveCredentials();
    setShowNamePrompt(false);
    if (pendingReaction) {
      submitReaction(pendingReaction);
      setPendingReaction(null);
    }
  };

  if (!clubData) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-1 ring-cream-300">
              <BookOpen className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{t("bookClub.noneTitle")}</h1>
            <p className="text-stone-500">{t("bookClub.noneText")}</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PublicNav />

      {/* Hero */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-600 shadow-md shadow-primary-600/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-800">
                {t("bookClub.title")}
              </h1>
              <p className="text-sm text-stone-500">{t("bookClub.subtitle")}</p>
            </div>
          </motion.div>

          {/* Book Card */}
          <Card
            variant="outlined"
            padding="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="shadow-xl rounded-3xl border-cream-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Cover */}
              <div className="md:w-48 lg:w-56 flex-shrink-0 bg-gradient-to-br from-cream-100 to-cream-200 p-6 flex items-center justify-center">
                {clubData.coverUrl ? (
                  <img
                    src={clubData.coverUrl}
                    alt={clubData.title}
                    className="w-32 md:w-full rounded-lg shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-48 rounded-lg bg-cream-200 flex items-center justify-center shadow-md ring-1 ring-cream-300">
                    <BookOpen className="w-12 h-12 text-white/70" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {t("bookClub.activePick")}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="w-3 h-3" />
                    {daysLeft > 0 ? t("bookClub.daysLeft", { count: daysLeft }) : t("bookClub.endingToday")}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">
                  {clubData.title}
                </h2>
                <p className="text-stone-500 text-lg mb-4">{t("common.byAuthor", { author: clubData.author })}</p>

                {clubData.description && (
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {clubData.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                  <Calendar className="w-4 h-4" />
                  {t("bookClub.readingUntil", {
                    date: formatDate(clubData.endDate, i18n.language, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
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
                          <span aria-hidden="true">{r.emoji}</span>
                          <span className="hidden sm:inline">{t(`bookClub.reactions.${r.key}`)}</span>
                          {count > 0 && (
                            <span className={`ml-1 text-xs ${isActive ? "text-white/80" : "text-stone-500"}`}>
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
          </Card>
        </div>
      </section>

      {/* Reactions-only note */}
      <section className="flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-cream-300">
            <p className="text-stone-600 font-medium mb-1">
              {detailedData && detailedData.totalReactions > 0
                ? t("bookClub.reactionsSoFar", { count: detailedData.totalReactions })
                : t("bookClub.beFirst")}
            </p>
            <p className="text-sm text-stone-500">
              {t("bookClub.tapEmoji")}
            </p>
          </div>
        </div>
      </section>

      {/* Name/Passcode Prompt Modal */}
      <AnimatePresence>
        {showNamePrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNamePrompt(false)} />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-bold text-stone-800 mb-2">{t("bookClub.leaveReaction")}</h3>
              <p className="text-sm text-stone-500 mb-4">
                {t("bookClub.passcodePrompt")}
              </p>
              <div className="space-y-3">
                <Input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder={t("wishlist.yourName")}
                />
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder={t("bookClub.passcodePlaceholder")}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowNamePrompt(false)}
                    className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handlePromptSubmit}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    {t("common.continue")}
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
