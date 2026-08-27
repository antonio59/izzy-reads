import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { PageMeta } from "./PageMeta";
import { pageMeta } from "../lib/seo";

interface AboutPageProps {
  aboutData: {
    isPublished: boolean;
    profilePhoto?: string;
    bio: string;
    favoriteGenres: string[];
    favoriteAuthors: string[];
    whyIRead: string;
    funFacts: string[];
    currentlyReading?: string;
    readingGoals: string[];
    achievements: string[];
  };
}

const DEFAULT_AVATAR: AvatarConfig = {
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

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
      )}
    </header>
  );
}

function AboutPage({ aboutData }: AboutPageProps) {
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  if (!aboutData.isPublished) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PageMeta
          title={pageMeta.about.title}
          description={pageMeta.about.description}
          path="/about"
        />
        <PublicNav />
        <div className="flex-1 flex items-center justify-center px-4 py-16 text-center">
          <div className="max-w-md">
            <div className="mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-primary-100 shadow-md w-fit">
              <AvatarPreview config={userAvatar} size="lg" />
            </div>
            <h1 className="font-accent text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
              About Izzy
            </h1>
            <p className="text-stone-500 leading-relaxed">
              This page is still being written — check back soon!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-8 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
            >
              Back to my bookshelf <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PageMeta
        title={pageMeta.about.title}
        description={pageMeta.about.description}
        path="/about"
      />
      <PublicNav />

      {/* ── Hero: one composition — avatar, brand, bio, CTA ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 0%, rgba(217,70,168,0.12), transparent 55%), radial-gradient(ellipse at 70% 100%, rgba(13,148,136,0.12), transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 text-center">
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="rounded-full overflow-hidden ring-2 ring-primary-100 shadow-lg">
              <AvatarPreview config={userAvatar} size="lg" />
            </div>

            <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide">
              Get to know me
            </p>

            <h1 className="font-accent text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.05]">
              About Izzy
            </h1>

            <p className="text-base sm:text-lg text-stone-500 max-w-lg leading-relaxed">
              {aboutData.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                Browse my shelf
                <ArrowRight className="w-4 h-4" />
              </Link>
              {aboutData.currentlyReading && (
                <a
                  href="#currently-reading"
                  className="inline-flex items-center gap-2 px-5 py-3 text-stone-600 hover:text-primary-700 font-display font-semibold text-sm transition-colors"
                >
                  What I&apos;m reading
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Soft shelf wash under hero — visual continuity with home */}
        <div className="relative h-16 sm:h-20 overflow-hidden" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-200/40 to-cream-100" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-cream-300" />
        </div>
      </section>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 w-full pb-16">
        {/* Why I read — lead story, not a card */}
        <section className="pt-4 sm:pt-6 mb-14 sm:mb-16">
          <SectionHeader title="Why I love reading" />
          <p className="text-lg text-stone-600 leading-relaxed font-serif italic">
            {aboutData.whyIRead}
          </p>
        </section>

        {/* Currently reading */}
        {aboutData.currentlyReading && (
          <section
            id="currently-reading"
            className="mb-14 sm:mb-16 scroll-mt-24"
          >
            <SectionHeader title="Currently reading" />
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent-600" aria-hidden />
              </div>
              <p className="text-lg font-display font-bold text-stone-800 leading-snug pt-2">
                {aboutData.currentlyReading}
              </p>
            </div>
          </section>
        )}

        {/* Favourites — open layout, no card grid */}
        <section className="mb-14 sm:mb-16 py-10 border-y border-cream-300">
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-12">
            <div>
              <h2 className="text-xl font-display font-bold text-stone-800 mb-4">
                Favourite genres
              </h2>
              <ul className="flex flex-wrap gap-2">
                {aboutData.favoriteGenres.map((genre) => (
                  <li
                    key={genre}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-stone-800 mb-4">
                Favourite authors
              </h2>
              <ul className="space-y-2.5">
                {aboutData.favoriteAuthors.map((author) => (
                  <li
                    key={author}
                    className="text-stone-600 flex items-center gap-2.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0"
                      aria-hidden
                    />
                    {author}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fun facts */}
        {aboutData.funFacts.length > 0 && (
          <section className="mb-14 sm:mb-16">
            <SectionHeader
              title="Fun facts"
              subtitle="A few things you might not know"
            />
            <ol className="space-y-4">
              {aboutData.funFacts.map((fact, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="font-accent text-primary-500 text-lg font-semibold tabular-nums w-6 flex-shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-stone-600 leading-relaxed pt-0.5">
                    {fact}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Goals */}
        {aboutData.readingGoals.length > 0 && (
          <section className="mb-14 sm:mb-16">
            <SectionHeader title="Reading goals" />
            <ul className="space-y-3">
              {aboutData.readingGoals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-3 text-stone-600 leading-relaxed"
                >
                  <span
                    className="mt-2 w-2 h-2 rounded-full bg-accent-400 flex-shrink-0"
                    aria-hidden
                  />
                  {goal}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {aboutData.achievements.length > 0 && (
          <section className="mb-14 sm:mb-16">
            <SectionHeader title="Achievements" />
            <ul className="flex flex-wrap gap-2.5">
              {aboutData.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium bg-cream-200 text-stone-700 border border-cream-300"
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Closing */}
        <p className="text-center text-stone-500 font-medium pt-4 pb-2">
          Keep reading, keep dreaming, keep being awesome
        </p>
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
          >
            Back to my bookshelf <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default AboutPage;
