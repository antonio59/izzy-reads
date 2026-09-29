import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OriginalLanguageToggleProps {
  showingOriginal: boolean;
  onToggle: () => void;
  /** "dark" for use on dark backgrounds */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Shown on Italian pages when Izzy has published a translation, so family
 * can flip between her Italian version and the English she wrote.
 */
export function OriginalLanguageToggle({
  showingOriginal,
  onToggle,
  tone = "light",
  className = "",
}: OriginalLanguageToggleProps) {
  const { t } = useTranslation();
  const colors =
    tone === "dark"
      ? "text-purple-100 hover:text-white ring-white/20 hover:bg-white/10"
      : "text-stone-500 hover:text-primary-700 ring-cream-300 hover:bg-cream-100";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={showingOriginal}
      className={`inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full text-xs font-semibold ring-1 transition-colors ${colors} ${className}`}
    >
      <Languages className="w-3.5 h-3.5" aria-hidden />
      {showingOriginal
        ? t("translation.showItalian")
        : t("translation.showOriginal")}
    </button>
  );
}

export default OriginalLanguageToggle;
