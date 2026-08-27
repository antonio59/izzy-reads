import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Feather,
  Compass,
  Trophy,
  Sparkles,
  X,
  ArrowRight,
  Library,
} from "lucide-react";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";

const STORAGE_KEY = "izzys-bookshelf-onboarding-v1";

type Step = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tip: string;
  icon: typeof BookOpen;
  cta?: { label: string; to: string };
  accent: string;
};

const STEPS: Step[] = [
  {
    id: "welcome",
    eyebrow: "Your bookshelf",
    title: "This is your reading home",
    body: "Log every book you finish — even if you don’t write a review. The shelf is your tracker and your brag board.",
    tip: "Reviews are optional. Showing up and logging is the habit.",
    icon: Library,
    accent: "from-primary-500 to-primary-600",
  },
  {
    id: "books",
    eyebrow: "My Bookshelf",
    title: "Add books the day you finish them",
    body: "Tap Add Book, find the cover, and mark it Finished or Reading. Tiny books count. Series count. Everything counts.",
    tip: "A full shelf looks cooler than a perfect review every time.",
    icon: BookOpen,
    cta: { label: "Open My Bookshelf", to: "/books" },
    accent: "from-primary-500 to-accent-500",
  },
  {
    id: "create",
    eyebrow: "Create",
    title: "Poems & writing live here too",
    body: "When a poem or story pops into your head, capture it in Create. You can polish later — don’t wait for perfect.",
    tip: "Short poems and quick posts still belong on your shelf.",
    icon: Feather,
    cta: { label: "Go write something", to: "/create" },
    accent: "from-accent-500 to-accent-600",
  },
  {
    id: "discover",
    eyebrow: "Discover",
    title: "Swipe for your next read",
    body: "Like books to save them on your wishlist. It’s a fun way to plan what comes after the one in your hands.",
    tip: "Liked covers get saved so your wishlist stays sharp.",
    icon: Compass,
    cta: { label: "Try Discover", to: "/discover" },
    accent: "from-teal-500 to-accent-600",
  },
  {
    id: "progress",
    eyebrow: "Progress",
    title: "Watch your year add up",
    body: "Goals, streaks, and levels grow when you log often. Come back after each book — it only takes a minute.",
    tip: "Frequent little updates beat rare big catch-ups.",
    icon: Trophy,
    cta: { label: "See Progress", to: "/progress" },
    accent: "from-amber-500 to-primary-500",
  },
];

function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "done";
  } catch {
    return true;
  }
}

function markOnboardingDone() {
  try {
    localStorage.setItem(STORAGE_KEY, "done");
  } catch {
    // ignore
  }
}

export function DashboardOnboarding() {
  const { prefersReducedMotion } = useMotionPreference();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      setOpen(true);
    }
  }, []);

  const close = () => {
    markOnboardingDone();
    setOpen(false);
  };

  const step = STEPS[stepIndex];
  const Icon = step.icon;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : undefined}
        >
          <button
            type="button"
            aria-label="Dismiss onboarding"
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", damping: 26, stiffness: 320 }
            }
            className="relative w-full max-w-lg bg-cream-50 rounded-3xl shadow-2xl border border-cream-300 overflow-hidden"
          >
            <div
              className={`h-28 bg-gradient-to-br ${step.accent} relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
              <button
                type="button"
                onClick={close}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {step.eyebrow}
                  </p>
                  <p className="text-sm font-medium text-white/90 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Step {stepIndex + 1} of {STEPS.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <h2
                id="onboarding-title"
                className="font-accent text-2xl sm:text-3xl font-semibold text-stone-900 mb-3"
              >
                {step.title}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">{step.body}</p>
              <p className="text-sm text-primary-800 bg-primary-50 border border-primary-100 rounded-xl px-3 py-2.5 mb-6">
                {step.tip}
              </p>

              <div className="flex items-center gap-1.5 mb-6" aria-hidden>
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= stepIndex ? "bg-primary-500" : "bg-stone-200"
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={close}
                  className="text-sm text-stone-500 hover:text-stone-700 px-2 py-2 order-2 sm:order-1"
                >
                  Skip for now
                </button>
                <div className="flex gap-2 order-1 sm:order-2">
                  {step.cta && (
                    <Link
                      to={step.cta.to}
                      onClick={close}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-stone-700 text-sm font-semibold hover:bg-cream-100 transition-colors"
                    >
                      {step.cta.label}
                    </Link>
                  )}
                  {isLast ? (
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors"
                    >
                      Let&apos;s go
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStepIndex((i) => i + 1)}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
