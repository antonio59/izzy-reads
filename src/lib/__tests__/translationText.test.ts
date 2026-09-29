import { describe, it, expect } from "vitest";
import {
  buildTranslationMessages,
  hashText,
  parseTranslationResponse,
  sourceHash,
} from "../../../convex/lib/translationText";

describe("hashText", () => {
  it("is stable for the same text", () => {
    expect(hashText("The volcano is a grumbler")).toBe(
      hashText("The volcano is a grumbler"),
    );
  });

  it("changes when the text changes", () => {
    expect(hashText("a")).not.toBe(hashText("b"));
  });
});

describe("sourceHash", () => {
  it("distinguishes title from body", () => {
    expect(sourceHash({ title: "ab", body: "c" })).not.toBe(
      sourceHash({ title: "a", body: "bc" }),
    );
  });
});

describe("buildTranslationMessages", () => {
  it("asks poems to keep their line breaks", () => {
    const [system] = buildTranslationMessages("poem", { body: "x" });
    expect(system.content).toMatch(/line breaks/);
    expect(system.content).toMatch(/a poem/);
  });

  it("passes review context through to the user message", () => {
    const [, user] = buildTranslationMessages("review", {
      body: "Loved it",
      context: "Review of Wonder by R.J. Palacio",
    });
    expect(JSON.parse(user.content)).toEqual({
      context: "Review of Wonder by R.J. Palacio",
      title: null,
      body: "Loved it",
    });
  });
});

describe("parseTranslationResponse", () => {
  it("parses plain JSON", () => {
    expect(
      parseTranslationResponse('{"title":"Il Vulcano","body":"Il vulcano brontola"}'),
    ).toEqual({ title: "Il Vulcano", body: "Il vulcano brontola" });
  });

  it("strips code fences and drops a null title", () => {
    expect(
      parseTranslationResponse('```json\n{"title":null,"body":"Ciao"}\n```'),
    ).toEqual({ body: "Ciao" });
  });

  it("rejects replies without a body", () => {
    expect(() => parseTranslationResponse('{"title":"x"}')).toThrow(/no body/);
  });

  it("rejects non-JSON replies", () => {
    expect(() => parseTranslationResponse("Ecco la traduzione")).toThrow(
      /not valid JSON/,
    );
  });
});
