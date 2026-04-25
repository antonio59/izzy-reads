import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  PenTool,
  X,
} from "lucide-react";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  content: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to your Bookshelf!",
    content:
      "This is YOUR special place to share the things you love — books, poems, and stories. Let’s show you around so you can get started right away.",
    emoji: "💜",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Track & Share Books",
    content:
      "Add books you have read, write reviews, and build your public bookshelf. Friends and family can leave fun reactions on your favourites!",
    emoji: "📚",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "You are all set!",
    content:
      "Write poems, blog about adventures, create your avatar, and level up as you read. Have fun — this is your reading adventure!",
    emoji: "🚀",
    icon: <PenTool className="w-8 h-8" />,
    color: "from-teal-500 to-emerald-500",
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(0);
  const { prefersReducedMotion } = useMotionPreference();

  const currentStep = TOUR_STEPS[step];
  const isLastStep = step === TOUR_STEPS.length - 1;
  const isFirstStep = step === 0;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  }, [isLastStep, onComplete]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        className="relative max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Skip button */}
        {!isLastStep && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-stone-100">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              {/* Icon */}
              <div
                className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentStep.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
              >
                {currentStep.icon}
              </div>

              {/* Emoji accent */}
              <span className="text-4xl block mb-3">{currentStep.emoji}</span>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-900 mb-4">
                {currentStep.title}
              </h2>

              {/* Description */}
              <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-sm mx-auto">
                {currentStep.content}
              </p>

              {/* Celebration confetti on last step */}
              {isLastStep && (
                <div className="mt-6 flex justify-center gap-3">
                  {["📚", "✍️", "🏆", "⭐", "💜"].map((emoji, i) => (
                    <span key={i} className="text-2xl">
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              isFirstStep
                ? "opacity-0 pointer-events-none"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {/* Step dots */}
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-purple-500 w-5"
                    : i < step
                      ? "bg-purple-300 w-2"
                      : "bg-stone-200 w-2"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
          >
            {isLastStep ? "Start Reading!" : "Next"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTour;
