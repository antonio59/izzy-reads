import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  LogIn,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Feather,
  Compass,
  Heart,
  Library,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { BookLogo } from "./PublicNav";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { Input, PasswordInput } from "./ui/Input";

const IZZY_AVATAR: AvatarConfig = {
  skinTone: "fair",
  hairStyle: "long",
  hairColor: "brown",
  eyeColor: "brown",
  accessory: "none",
  background: "pink",
  outfit: "tshirt",
  outfitColor: "pink",
  expression: "happy",
};

const REMINDERS = [
  {
    icon: Library,
    title: "Log it the day you finish",
    body: "Even without a review — your shelf is the tracker and the brag board.",
  },
  {
    icon: BookOpen,
    title: "Tiny books still count",
    body: "Series, rereads, short ones — add them under My Bookshelf.",
  },
  {
    icon: Feather,
    title: "Poems & stories live in Create",
    body: "Capture ideas fast. You can polish later — don’t wait for perfect.",
  },
  {
    icon: Compass,
    title: "Discover fills your wishlist",
    body: "Swipe and like covers you want next. Friends can gift from there.",
  },
] as const;

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { prefersReducedMotion } = useMotionPreference();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>Hey Izzy — Sign in | Izzy&apos;s Bookshelf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="relative z-10 px-4 pt-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Izzy's Bookshelf home"
          >
            <BookLogo className="w-8 h-8 text-primary-500 group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-stone-800">
              Izzy&apos;s Bookshelf
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Public shelf
          </Link>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 py-10 sm:py-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 0%, rgba(217,70,168,0.12), transparent 50%), radial-gradient(ellipse at 85% 100%, rgba(13,148,136,0.12), transparent 48%)",
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-5xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-start"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {/* Personal welcome */}
          <div className="text-center lg:text-left lg:pt-4">
            <div className="inline-flex lg:flex mx-auto lg:mx-0 mb-5 rounded-full overflow-hidden ring-2 ring-primary-100 shadow-md">
              <AvatarPreview config={IZZY_AVATAR} size="lg" />
            </div>

            <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide mb-2">
              Your private bookshelf
            </p>
            <h1 className="font-accent text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-stone-900 tracking-tight leading-[1.1] mb-3">
              Hey Izzy — welcome back
            </h1>
            <p className="text-stone-500 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
              This is your space to log finished books, jot poems, grow your
              wishlist, and peek at progress — friends only see what you share
              on the public shelf.
            </p>

            <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
              {REMINDERS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-cream-300 text-primary-600">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display font-bold text-stone-800 text-sm">
                      {title}
                    </p>
                    <p className="text-sm text-stone-500 leading-snug mt-0.5">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 inline-flex items-center gap-2 text-sm text-accent-700 font-medium">
              <Heart className="w-4 h-4 fill-accent-600/20" aria-hidden />
              Little updates often beat one big catch-up
            </p>
          </div>

          {/* Sign-in */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white/80 backdrop-blur-sm border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-sm"
              aria-labelledby="signin-heading"
            >
              <div className="mb-1">
                <h2
                  id="signin-heading"
                  className="font-display font-bold text-xl text-stone-900"
                >
                  Sign in
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Use the email and password for this bookshelf.
                </p>
              </div>

              {error && (
                <motion.div
                  className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 leading-snug font-medium">
                      {error}
                    </p>
                    <p className="text-xs text-red-700/80 mt-1 leading-snug">
                      Double-check spelling — or ask for a password reset if
                      you&apos;re stuck.
                    </p>
                  </div>
                </motion.div>
              )}

              <Input
                label="Your email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your.email@example.com"
                icon={<Mail className="w-5 h-5" />}
                className="bg-white border-cream-300"
              />

              <PasswordInput
                label="Your password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-white border-cream-300"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                {loading ? (
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Open my bookshelf
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-cream-200 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  After you sign in
                </p>
                <ul className="text-sm text-stone-500 space-y-1.5 leading-snug">
                  <li>
                    <span className="font-medium text-stone-700">Home</span> —
                    goals, recent books, quick actions
                  </li>
                  <li>
                    <span className="font-medium text-stone-700">
                      My Bookshelf
                    </span>{" "}
                    — add / finish books &amp; write reviews
                  </li>
                  <li>
                    <span className="font-medium text-stone-700">Create</span> —
                    poems, writing, and posts for the site
                  </li>
                </ul>
              </div>
            </form>

            <p className="mt-5 text-center lg:text-left text-sm text-stone-500 leading-relaxed">
              Not Izzy? You can still browse the{" "}
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                public shelf
              </Link>
              ,{" "}
              <Link
                to="/reviews"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                reviews
              </Link>
              , and{" "}
              <Link
                to="/my-wishlist"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                wishlist
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
