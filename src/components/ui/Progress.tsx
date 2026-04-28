import { motion } from "framer-motion";
import { Card } from "./Card";

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  color?: "primary" | "accent" | "success" | "gradient" | "sage";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorStyles = {
  primary: "bg-primary-500",
  accent: "bg-accent-500",
  success: "bg-success-500",
  gradient: "bg-gradient-to-r from-primary-500 via-accent-400 to-success-500",
  sage: "bg-sage-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  color = "primary",
  size = "md",
  showLabel = false,
  animated = true,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-stone-600">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-stone-400">{max.toLocaleString()}</span>
        </div>
      )}
      <div
        className={`w-full bg-stone-100 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <motion.div
          className={`h-full rounded-full ${colorStyles[color]}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Reading Challenge Progress
interface ChallengeProgressProps {
  title: string;
  current: number;
  target: number;
  icon?: string;
  color?: "primary" | "accent" | "success";
  dueDate?: string;
  className?: string;
}

export function ChallengeProgress({
  title,
  current,
  target,
  icon = "📚",
  color = "primary",
  dueDate,
  className = "",
}: ChallengeProgressProps) {
  const percentage = Math.round((current / target) * 100);
  const isComplete = current >= target;

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-stone-900 truncate">
              {title}
            </h4>
            {isComplete && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg"
              >
                🎉
              </motion.span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-stone-600">
                {current} / {target}
              </span>
              <span
                className={`font-medium ${isComplete ? "text-success-600" : "text-stone-500"}`}
              >
                {percentage}%
              </span>
            </div>
            <Progress value={current} max={target} color={color} size="md" />
          </div>

          {dueDate && !isComplete && (
            <p className="text-xs text-stone-400 mt-2">Due: {dueDate}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Progress;
