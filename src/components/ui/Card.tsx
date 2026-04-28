import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type CardVariant =
  | "default"
  | "elevated"
  | "interactive"
  | "outlined"
  | "gradient";
export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-soft",
  elevated: "bg-white shadow-soft-md",
  interactive: "bg-white shadow-soft hover:shadow-soft-lg cursor-pointer",
  outlined: "bg-white border border-stone-200",
  gradient: "bg-gradient-to-br from-primary-50 to-accent-50 shadow-soft",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      children,
      hoverEffect = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = "rounded-2xl overflow-hidden";

    return (
      <motion.div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

// Stat Card - specialized card for displaying statistics
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "accent" | "success" | "stone" | "sage";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "primary",
  className = "",
}: StatCardProps) {
  const colorStyles = {
    primary: "text-primary-500",
    accent: "text-accent-500",
    success: "text-success-500",
    stone: "text-stone-500",
    sage: "text-sage-500",
  };

  const bgStyles = {
    primary: "bg-primary-50",
    accent: "bg-accent-50",
    success: "bg-success-50",
    stone: "bg-stone-50",
    sage: "bg-sage-50",
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p
            className={`text-3xl font-bold font-display mt-1 ${colorStyles[color]}`}
          >
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs mt-2 ${trend.isPositive ? "text-success-600" : "text-error-500"}`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${bgStyles[color]}`}>
            <span className={colorStyles[color]}>{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default Card;
