import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { BookLogo } from "./PublicNav";
import { Input, PasswordInput } from "./ui/Input";

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
        <title>Sign in | Izzy&apos;s Bookshelf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="relative z-10 px-4 pt-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
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
            Shelf
          </Link>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 0%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(13,148,136,0.12), transparent 50%)",
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div className="text-center mb-8">
            <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide mb-3">
              Private bookshelf
            </p>
            <h1 className="font-accent text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-stone-500 leading-relaxed">
              Sign in to log books, write poems, and keep your shelf growing.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white/70 backdrop-blur-sm border border-cream-300 rounded-3xl p-6 sm:p-8"
          >
            {error && (
              <motion.div
                className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3"
                initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 leading-snug">{error}</p>
              </motion.div>
            )}

            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              className="bg-white border-cream-300"
            />

            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your password"
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
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 leading-relaxed">
            This sign-in is for Izzy&apos;s bookshelf — friends can still
            browse the{" "}
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              public shelf
            </Link>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
