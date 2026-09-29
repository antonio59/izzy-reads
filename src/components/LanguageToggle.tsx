import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type Language } from "../i18n";

const LABELS: Record<Language, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  it: { short: "IT", name: "Italiano" },
};

/** Compact EN | IT switch – remembers the choice in localStorage. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const active: Language = i18n.resolvedLanguage?.startsWith("it") ? "it" : "en";

  return (
    <div
      role="group"
      aria-label={t("language.choose")}
      className={`inline-flex rounded-lg bg-cream-200 p-0.5 ${className}`}
    >
      {SUPPORTED_LANGUAGES.map((lng) => {
        const isActive = lng === active;
        return (
          <button
            key={lng}
            type="button"
            lang={lng}
            aria-pressed={isActive}
            aria-label={LABELS[lng].name}
            onClick={() => void i18n.changeLanguage(lng)}
            className={`min-w-11 min-h-9 px-2 rounded-md text-xs font-bold tracking-wide transition-colors ${
              isActive
                ? "bg-white text-primary-700 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {LABELS[lng].short}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
