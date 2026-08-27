import { motion } from "framer-motion";

export type BadgeVariant =
  | "primary"
  | "accent"
  | "stone"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "gray"
  | "default";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  animated?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-700 border-primary-200",
  accent: "bg-accent-100 text-accent-700 border-accent-200",
  stone: "bg-stone-100 text-stone-700 border-stone-200",
  success: "bg-success-50 text-success-600 border-success-100",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-error-50 text-error-600 border-error-100",
  outline: "bg-transparent text-stone-600 border-stone-300",
  default: "bg-stone-100 text-stone-600 border-stone-200",
  gray: "bg-stone-100 text-stone-700 border-stone-200",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  icon,
  removable = false,
  onRemove,
  className = "",
  animated = false,
}: BadgeProps) {
  const Component = animated ? motion.span : "span";
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...animationProps}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </Component>
  );
}

// Streak Badge - for reading streaks
interface StreakBadgeProps {
  days: number;
  className?: string;
}

export function StreakBadge({ days, className = "" }: StreakBadgeProps) {
  const isActive = days > 0;
  const isMilestone = days >= 7 || days >= 30 || days >= 100;

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-xl
        ${isActive ? "bg-gradient-to-r from-accent-100 to-amber-100" : "bg-stone-100"}
        ${className}
      `}
      animate={isMilestone ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isMilestone ? Infinity : 0, duration: 2 }}
    >
      <span className="text-2xl">{isActive ? "🔥" : "❄️"}</span>
      <div>
        <p
          className={`font-bold ${isActive ? "text-accent-600" : "text-stone-500"}`}
        >
          {days} day{days !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-stone-500">Reading streak</p>
      </div>
    </motion.div>
  );
}

export default Badge;
