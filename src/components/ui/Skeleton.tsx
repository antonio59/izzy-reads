import { motion } from "framer-motion";
import { useMemo } from "react";
import { Card } from "./Card";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseStyles = "bg-stone-200";

  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-xl",
  };

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (animation === "wave") {
    return (
      <div
        className={`${baseStyles} ${variantStyles[variant]} overflow-hidden relative ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common patterns
export function BookCardSkeleton() {
  return (
    <Card variant="default" padding="sm">
      <Skeleton
        variant="rounded"
        className="w-full aspect-[2/3] mb-4"
        animation="wave"
      />
      <Skeleton variant="text" className="h-4 w-3/4 mb-2" animation="wave" />
      <Skeleton variant="text" className="h-3 w-1/2" animation="wave" />
    </Card>
  );
}

export function BookshelfSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card variant="default" padding="md" key={i}>
          <div className="flex items-center gap-4">
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              animation="wave"
            />
            <div className="flex-1">
              <Skeleton
                variant="text"
                className="h-4 w-20 mb-2"
                animation="wave"
              />
              <Skeleton variant="text" className="h-6 w-16" animation="wave" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  const heights = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${20 + ((i * 7 + 3) % 80)}%`),
    [],
  );

  return (
    <Card variant="default" padding="md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton variant="text" className="h-5 w-32 mb-1" animation="wave" />
          <Skeleton variant="text" className="h-3 w-24" animation="wave" />
        </div>
        <Skeleton variant="rounded" className="h-6 w-20" animation="wave" />
      </div>
      <div className="h-48 flex items-end gap-2">
        {heights.map((height, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            className="flex-1"
            height={height}
            animation="wave"
          />
        ))}
      </div>
    </Card>
  );
}

export function PoemCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
      <div className="flex justify-center mb-4">
        <Skeleton variant="circular" width={60} height={60} animation="wave" />
      </div>
      <Skeleton
        variant="text"
        className="h-6 w-2/3 mx-auto mb-4"
        animation="wave"
      />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" animation="wave" />
        <Skeleton
          variant="text"
          className="h-4 w-5/6 mx-auto"
          animation="wave"
        />
        <Skeleton
          variant="text"
          className="h-4 w-4/6 mx-auto"
          animation="wave"
        />
      </div>
    </div>
  );
}

export function PoemGallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PoemCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <Card variant="default" padding="md">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <div>
          <Skeleton variant="text" className="h-4 w-24 mb-1" animation="wave" />
          <Skeleton variant="text" className="h-3 w-16" animation="wave" />
        </div>
      </div>
      <Skeleton variant="text" className="h-6 w-3/4 mb-3" animation="wave" />
      <div className="space-y-2 mb-4">
        <Skeleton variant="text" className="h-4 w-full" animation="wave" />
        <Skeleton variant="text" className="h-4 w-full" animation="wave" />
        <Skeleton variant="text" className="h-4 w-2/3" animation="wave" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" className="h-6 w-16" animation="wave" />
        <Skeleton variant="rounded" className="h-6 w-20" animation="wave" />
      </div>
    </Card>
  );
}

export function AchievementsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="text-center p-4">
          <Skeleton
            variant="circular"
            width={64}
            height={64}
            className="mx-auto mb-3"
            animation="wave"
          />
          <Skeleton
            variant="text"
            className="h-4 w-20 mx-auto mb-1"
            animation="wave"
          />
          <Skeleton
            variant="text"
            className="h-3 w-24 mx-auto"
            animation="wave"
          />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <Card variant="default" padding="lg">
      <div className="flex flex-col items-center mb-6">
        <Skeleton
          variant="circular"
          width={96}
          height={96}
          className="mb-4"
          animation="wave"
        />
        <Skeleton variant="text" className="h-6 w-32 mb-2" animation="wave" />
        <Skeleton variant="text" className="h-4 w-24" animation="wave" />
      </div>
      <div className="space-y-4">
        <Skeleton variant="rounded" className="h-16 w-full" animation="wave" />
        <Skeleton variant="rounded" className="h-16 w-full" animation="wave" />
        <Skeleton variant="rounded" className="h-16 w-full" animation="wave" />
      </div>
    </Card>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-stone-100">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={`h-4 ${i === 0 ? "w-32" : "flex-1"}`}
          animation="wave"
        />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <div className="flex items-center gap-4 p-4 bg-stone-50 border-b border-stone-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={`h-4 ${i === 0 ? "w-24" : "flex-1"}`}
            animation="wave"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </Card>
  );
}

export default Skeleton;
