import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Feather, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PublicNav, BookLogo } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";

const NotFound: React.FC = () => {
  const { prefersReducedMotion } = useMotionPreference();

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>Page not found | Izzy&apos;s Bookshelf</title>
        <meta
          name="description"
          content="This page wandered off the shelf. Head back to Izzy's Bookshelf."
        />
      </Helmet>

      <PublicNav />

      <main className="relative flex-1 flex items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 25% 10%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(13,148,136,0.12), transparent 50%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-lg w-full text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <BookLogo className="w-9 h-9" />
            </div>
          </div>

          <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide mb-3">
            Lost on the shelf
          </p>

          <p
            className="font-accent text-7xl sm:text-8xl font-semibold text-stone-900/10 select-none mb-2 leading-none"
            aria-hidden
          >
            404
          </p>

          <h1 className="font-accent text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight leading-tight mb-3">
            This page wandered off
          </h1>
          <p className="text-stone-500 leading-relaxed mb-8 max-w-md mx-auto">
            It isn&apos;t on Izzy&apos;s Bookshelf — or it moved. Try home, or
            pick a favourite corner below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Back to Bookshelf
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-3 text-stone-600 hover:text-primary-700 font-display font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-primary-700 font-medium transition-colors"
            >
              <Star className="w-3.5 h-3.5" />
              Reviews
            </Link>
            <Link
              to="/poetry"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-primary-700 font-medium transition-colors"
            >
              <Feather className="w-3.5 h-3.5" />
              Poems
            </Link>
            <Link
              to="/my-wishlist"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-primary-700 font-medium transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-primary-700 font-medium transition-colors"
            >
              About
            </Link>
          </div>
        </motion.div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default NotFound;
