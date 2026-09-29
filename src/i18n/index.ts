import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./locales/en";
import { it } from "./locales/it";

export const SUPPORTED_LANGUAGES = ["en", "it"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "izzy-lang";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, it: { translation: it } },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
    returnNull: false,
  });

function syncHtmlLang(lng: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng.startsWith("it") ? "it" : "en";
  }
}
syncHtmlLang(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", syncHtmlLang);

/** Current UI language, narrowed to one we support. */
export function currentLanguage(): Language {
  return i18n.resolvedLanguage?.startsWith("it") ? "it" : "en";
}

/** Locale tag for Intl date/number formatting. */
export function currentLocale(): string {
  return currentLanguage() === "it" ? "it-IT" : "en-US";
}

export default i18n;
