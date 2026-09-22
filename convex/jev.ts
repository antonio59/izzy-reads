declare const process: { env: Record<string, string | undefined> };

// TypeSafe System One (Jev) HTTP client.
// Jev returns typed judgments over supplied state – it does not generate text,
// so callers ask narrow questions and compose the answers in code.
// API reference: https://docs.typesafe.ai/api

export type JevQuestion =
  | {
      type: "noul";
      instructions: unknown;
      criteria?: { true?: unknown; false?: unknown };
    }
  | {
      type: "choice";
      instructions: unknown;
      criteria: Record<string, unknown>;
    }
  | { type: "score"; instructions: unknown; criteria: unknown[] };

export interface JevNoulAnswer {
  type: "noul";
  noul: number;
}

export interface JevChoiceAnswer {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface JevScoreAnswer {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}

export type JevAnswer = JevNoulAnswer | JevChoiceAnswer | JevScoreAnswer;

const TYPESAFE_URL = "https://api.typesafe.ai/v1/systemone";
const JEV_MODEL = "jev-latest";

// Ask Jev a set of questions over one state. Returns the answers map keyed by
// question id, or null when the key is missing or the call fails – callers
// should treat null as "no judgment" and continue without it.
export async function askJev(
  state: unknown,
  questions: Record<string, JevQuestion>,
): Promise<Record<string, JevAnswer> | null> {
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    console.warn("TYPESAFE_API_KEY not set, skipping Jev evaluation");
    return null;
  }

  try {
    const res = await fetch(TYPESAFE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ state, model: JEV_MODEL, questions }),
    });

    if (!res.ok) {
      console.error(`TypeSafe API returned ${res.status}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return (data.answers ?? null) as Record<string, JevAnswer> | null;
  } catch (err) {
    console.error("TypeSafe request failed:", err);
    return null;
  }
}
