import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  Target,
  Check,
  Rocket,
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  name: string;
  age: number;
  favoriteGenres: string[];
  readingGoal: number;
  firstBookTitle?: string;
}

const GENRES = [
  { id: "fantasy", label: "Fantasy", emoji: "🧙‍♂️" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
  { id: "mystery", label: "Mystery", emoji: "🔍" },
  { id: "scifi", label: "Sci-Fi", emoji: "🚀" },
  { id: "realistic", label: "Realistic Fiction", emoji: "💭" },
  { id: "horror", label: "Spooky Stories", emoji: "👻" },
  { id: "humor", label: "Funny Books", emoji: "😂" },
  { id: "animals", label: "Animal Stories", emoji: "🐾" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "historical", label: "Historical", emoji: "🏰" },
  { id: "graphic", label: "Graphic Novels", emoji: "📚" },
  { id: "nonfiction", label: "Non-Fiction", emoji: "🎓" },
];

const READING_GOALS = [
  {
    value: 12,
    label: "1 book/month",
    emoji: "📖",
    description: "Perfect for busy readers!",
  },
  {
    value: 24,
    label: "2 books/month",
    emoji: "📚",
    description: "A great challenge!",
  },
  {
    value: 36,
    label: "3 books/month",
    emoji: "🌟",
    description: "Super reader mode!",
  },
  {
    value: 52,
    label: "1 book/week",
    emoji: "🚀",
    description: "Reading champion!",
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: 10,
    favoriteGenres: [],
    readingGoal: 24,
  });

  const steps = [
    { title: "Welcome", icon: <Sparkles className="w-8 h-8" /> },
    { title: "About You", icon: <BookOpen className="w-8 h-8" /> },
    { title: "Favorite Genres", icon: <BookOpen className="w-8 h-8" /> },
    { title: "Reading Goal", icon: <Target className="w-8 h-8" /> },
    { title: "Ready!", icon: <Rocket className="w-8 h-8" /> },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return data.name.trim().length > 0;
      case 2:
        return data.favoriteGenres.length > 0;
      case 3:
        return data.readingGoal > 0;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const toggleGenre = (genreId: string) => {
    setData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genreId)
        ? prev.favoriteGenres.filter((g) => g !== genreId)
        : [...prev.favoriteGenres, genreId],
    }));
  };

  const floatingDecorations = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: (i * 11 + 3) % 100,
        top: (i * 13 + 2) % 100,
        duration: 3 + (i % 3) * 0.7 + 0.5,
        delay: (i % 4) * 0.5,
        emoji: ["📚", "✨", "🌟", "📖", "🎯", "🦋", "🌈", "💫", "⭐", "🏆"][i],
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 flex items-center justify-center p-4">
      {/* Floating decorations */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {floatingDecorations.map((d, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: d.duration,
              repeat: Infinity,
              delay: d.delay,
            }}
          >
            {d.emoji}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress bar */}
        <div className="h-2 bg-stone-100">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-5xl">📚</span>
                </motion.div>

                <h1 className="text-4xl font-display font-bold text-stone-900 mb-4">
                  Welcome to Izzy's Bookshelf!
                </h1>
                <p className="text-xl text-stone-600 mb-8">
                  Your magical reading adventure starts here. Let's set up your
                  profile!
                </p>

                <div className="flex justify-center gap-4">
                  {["📖", "✨", "🏆", "📝", "🎯"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: About You */}
            {step === 1 && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">👋</span>
                  <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">
                    What's your name?
                  </h2>
                  <p className="text-stone-600">
                    We'll use this to personalize your experience
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-6">
                  <div>
                    <Input
                      label="Your Name"
                      type="text"
                      value={data.name}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter your name..."
                      className="text-center"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Input
                      label="Your Age"
                      type="number"
                      value={data.age}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          age: parseInt(e.target.value) || 10,
                        }))
                      }
                      min={5}
                      max={18}
                      className="text-center"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Favorite Genres */}
            {step === 2 && (
              <motion.div
                key="genres"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">🎭</span>
                  <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">
                    What do you love to read?
                  </h2>
                  <p className="text-stone-600">
                    Pick your favorite genres (select at least one!)
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GENRES.map((genre) => (
                    <motion.button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        data.favoriteGenres.includes(genre.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl block mb-1">{genre.emoji}</span>
                      <span className="font-medium text-stone-900 text-sm">
                        {genre.label}
                      </span>
                      {data.favoriteGenres.includes(genre.id) && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="w-5 h-5 text-purple-600" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Reading Goal */}
            {step === 3 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">🎯</span>
                  <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">
                    Set your reading goal!
                  </h2>
                  <p className="text-stone-600">
                    How many books do you want to read this year?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                  {READING_GOALS.map((goal) => (
                    <motion.button
                      key={goal.value}
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          readingGoal: goal.value,
                        }))
                      }
                      className={`p-5 rounded-2xl border-2 transition-all text-center ${
                        data.readingGoal === goal.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-4xl block mb-2">{goal.emoji}</span>
                      <span className="font-bold text-stone-900 block">
                        {goal.value} books
                      </span>
                      <span className="text-sm text-stone-500">
                        {goal.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-sm text-stone-500 mt-4">
                  Don't worry, you can always change this later!
                </p>
              </motion.div>
            )}

            {/* Step 4: Ready */}
            {step === 4 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Rocket className="w-16 h-16 text-white" />
                </motion.div>

                <h2 className="text-4xl font-display font-bold text-stone-900 mb-4">
                  You're all set, {data.name}!
                </h2>
                <p className="text-xl text-stone-600 mb-8">
                  Your reading adventure awaits. Let's explore amazing books
                  together!
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-md mx-auto mb-6">
                  <h3 className="font-bold text-stone-900 mb-3">
                    Your Profile Summary:
                  </h3>
                  <div className="space-y-2 text-left">
                    <p className="flex justify-between">
                      <span className="text-stone-600">Name:</span>
                      <span className="font-medium">{data.name}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-600">Age:</span>
                      <span className="font-medium">{data.age} years old</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-600">Reading Goal:</span>
                      <span className="font-medium">
                        {data.readingGoal} books/year
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-stone-600">Genres:</span>
                      <span className="font-medium">
                        {data.favoriteGenres.length} selected
                      </span>
                    </p>
                  </div>
                </div>

                {/* Celebration confetti */}
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl pointer-events-none"
                    style={{ left: `${(i * 19 + 3) % 100}%` }}
                    initial={{ top: "-10%", opacity: 1 }}
                    animate={{
                      top: "110%",
                      rotate: 360 * (i % 2 === 0 ? 1 : -1),
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 2 + (i % 3) * 0.3 + 0.4,
                      delay: (i % 6) * 0.08,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    {["🎉", "⭐", "✨", "🌟", "💫", "🎊"][i % 6]}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              step === 0
                ? "opacity-0 pointer-events-none"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step
                    ? "bg-purple-500 w-4"
                    : i < step
                      ? "bg-purple-300"
                      : "bg-stone-200"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
            variant="primary"
            icon={<ChevronRight className="w-5 h-5" />}
            iconPosition="right"
          >
            {step === steps.length - 1 ? "Start Reading!" : "Continue"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
