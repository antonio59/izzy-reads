import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "convex/_generated"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // New rules from react-hooks v7 - downgrade to warn for incremental adoption
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "useAuth",
            "useBooks",
            "useGamification",
            "useTheme",
            "useUser",
            "useToast",
            "useAnnounce",
            "usePoliteAnnounce",
            "useAssertiveAnnounce",
            "getBookGradient",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Design system: stone-400 fails WCAG contrast as text – keep it for
      // borders/decoration only. See DESIGN-AUDIT finding D1.
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/text-stone-(3|4)00/]",
          message:
            "text-stone-300/400 fail WCAG contrast for text; use text-stone-500 (or darker) for copy.",
        },
      ],
    },
  },
);
