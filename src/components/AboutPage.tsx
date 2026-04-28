import { motion } from "framer-motion";
import { User, BookOpen, Heart, Target, Award, Sparkles } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { useUser } from "../contexts/UserContext";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function AboutPage({ aboutData }: AboutPageProps) {
  const { user } = useUser();

  // Default avatar config
  const defaultAvatar: AvatarConfig = {
    skinTone: "fair",
    hairStyle: "long",
    hairColor: "brown",
    eyeColor: "brown",
    accessory: "none",
    background: "pink",
    outfit: "tshirt",
    outfitColor: "purple",
    expression: "happy",
  };

  const userAvatar = user?.avatar || defaultAvatar;

  if (!aboutData.isPublished) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-primary-500" />
            </div>
            <h1 className="text-2xl font-display font-bold text-stone-800 mb-2">
              About Me - Coming Soon!
            </h1>
            <p className="text-stone-500">
              Check back soon to learn more about Izzy!
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Navigation */}
      <PublicNav />

      <div className="flex-1 py-8 px-4">
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <div className="relative p-6 sm:p-8 bg-primary-600">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Profile Photo / Avatar */}
                  <div className="flex-shrink-0 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <AvatarPreview config={userAvatar} size="lg" />
                  </div>

                  {/* Bio */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                      Hi, I'm Izzy!
                    </h1>
                    <p className="text-white/90 leading-relaxed">
                      {aboutData.bio}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Two Column Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Currently Reading */}
            {aboutData.currentlyReading && (
              <motion.div variants={itemVariants}>
                <Card className="h-full p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-sage-600" />
                    </div>
                    <h2 className="font-display font-bold text-stone-800">
                      Currently Reading
                    </h2>
                  </div>
                  <p className="text-stone-600 bg-sage-50 p-3 rounded-lg text-sm">
                    {aboutData.currentlyReading}
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Why I Love Reading */}
            <motion.div variants={itemVariants}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    Why I Love Reading
                  </h2>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {aboutData.whyIRead}
                </p>
              </Card>
            </motion.div>

            {/* Favorite Genres */}
            <motion.div variants={itemVariants}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    Favorite Genres
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutData.favoriteGenres.map((genre, idx) => (
                    <Badge key={idx} variant="primary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Favorite Authors */}
            <motion.div variants={itemVariants}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    Favorite Authors
                  </h2>
                </div>
                <ul className="space-y-1.5">
                  {aboutData.favoriteAuthors.map((author, idx) => (
                    <li
                      key={idx}
                      className="text-stone-600 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      {author}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Fun Facts */}
          {aboutData.funFacts.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    Fun Facts About Me
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {aboutData.funFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50 p-3 rounded-lg text-sm text-stone-600 border border-amber-100"
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Reading Goals */}
          {aboutData.readingGoals.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-sage-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    My Reading Goals
                  </h2>
                </div>
                <ul className="space-y-2">
                  {aboutData.readingGoals.map((goal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 bg-sage-50 p-3 rounded-lg text-sm text-stone-600 border border-sage-100"
                    >
                      <Target className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}

          {/* Achievements */}
          {aboutData.achievements.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="font-display font-bold text-stone-800">
                    Reading Achievements
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {aboutData.achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="bg-primary-50 p-3 rounded-lg text-sm text-stone-700 font-medium flex items-center gap-2 border border-primary-100"
                    >
                      <Award className="w-4 h-4 text-primary-500" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Signature Tagline */}
          <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
            <p className="text-stone-600 font-medium">
              Keep reading, keep dreaming, keep being awesome ✨
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

export default AboutPage;
