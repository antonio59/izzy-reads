import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

function Skeleton({
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

export default Skeleton;
