import type { FunctionReturnType } from "convex/server";
import type { api } from "../../../convex/_generated/api";

export type TranslationItem = FunctionReturnType<
  typeof api.translations.listForAdmin
>[number];

export const STATUS_STYLES: Record<
  TranslationItem["status"],
  { label: string; className: string }
> = {
  none: { label: "No Italian yet", className: "bg-stone-100 text-stone-600" },
  draft: {
    label: "Waiting for you to check",
    className: "bg-amber-100 text-amber-800",
  },
  published: {
    label: "Published in Italian",
    className: "bg-green-100 text-green-800",
  },
  outdated: {
    label: "English changed – update Italian",
    className: "bg-orange-100 text-orange-800",
  },
};
