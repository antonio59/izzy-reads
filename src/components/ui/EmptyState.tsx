import type { ElementType, ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  /** Lucide-style component, or an emoji string for public pages. */
  icon?: ElementType | string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Extra content (e.g. a Link) rendered under the action area. */
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-14 px-4 ${className}`}>
      {typeof Icon === "string" ? (
        <div className="text-5xl mb-4" aria-hidden="true">
          {Icon}
        </div>
      ) : Icon ? (
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-10 h-10 text-stone-500" />
        </div>
      ) : null}
      <h3 className="text-xl font-display font-bold text-stone-700 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-stone-500 max-w-md mx-auto mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}

export default EmptyState;
