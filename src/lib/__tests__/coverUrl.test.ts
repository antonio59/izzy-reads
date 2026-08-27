import { describe, expect, it } from "vitest";
import {
  googleVolumeCoverUrl,
  isLikelyInvalidCover,
  openLibraryIsbnCover,
  parseIsbn,
  resolveBestCoverUrl,
  upgradeCoverUrl,
} from "../coverUrl";

describe("parseIsbn", () => {
  it("accepts ISBN-13 with hyphens", () => {
    expect(parseIsbn("978-0-545-01022-1")).toBe("9780545010221");
  });

  it("accepts ISBN-10", () => {
    expect(parseIsbn("0439708184")).toBe("0439708184");
  });

  it("rejects non-ISBN queries", () => {
    expect(parseIsbn("Harry Potter")).toBeNull();
  });
});

describe("upgradeCoverUrl", () => {
  it("upgrades Open Library -M to -L", () => {
    expect(
      upgradeCoverUrl("https://covers.openlibrary.org/b/id/8235116-M.jpg"),
    ).toBe("https://covers.openlibrary.org/b/id/8235116-L.jpg");
  });

  it("upgrades Google Books zoom and strips curl", () => {
    const input =
      "http://books.google.com/books/content?id=abc&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
    const out = upgradeCoverUrl(input);
    expect(out.startsWith("https://")).toBe(true);
    expect(out).toContain("zoom=3");
    expect(out).not.toContain("edge=curl");
  });

  it("does not treat lookalike hosts as Google Books", () => {
    const evil =
      "https://books.google.evil.com/books/content?id=abc&zoom=1&edge=curl";
    const out = upgradeCoverUrl(evil);
    expect(out).not.toContain("zoom=3");
    expect(out).toContain("books.google.evil.com");
  });

  it("leaves Convex storage URLs alone", () => {
    const url = "https://helpful-xyz.convex.cloud/api/storage/abc";
    expect(upgradeCoverUrl(url)).toBe(url);
  });

  it("leaves data URLs alone", () => {
    const url = "data:image/png;base64,aaa";
    expect(upgradeCoverUrl(url)).toBe(url);
  });
});

describe("resolveBestCoverUrl", () => {
  it("prefers upgraded image URL", () => {
    expect(
      resolveBestCoverUrl({
        imageUrl: "https://covers.openlibrary.org/b/id/1-S.jpg",
        isbn: "9780545010221",
      }),
    ).toBe("https://covers.openlibrary.org/b/id/1-L.jpg");
  });

  it("falls back to ISBN Open Library cover", () => {
    expect(
      resolveBestCoverUrl({
        imageUrl: "",
        isbn: "978-0-545-01022-1",
      }),
    ).toBe(openLibraryIsbnCover("978-0-545-01022-1"));
  });

  it("falls back to Google volume cover", () => {
    expect(
      resolveBestCoverUrl({
        googleVolumeId: "xyz123",
      }),
    ).toBe(googleVolumeCoverUrl("xyz123"));
  });
});

describe("isLikelyInvalidCover", () => {
  it("flags placeholders", () => {
    expect(isLikelyInvalidCover("/placeholder-book-cover.svg")).toBe(true);
    expect(isLikelyInvalidCover("https://example.com/no-cover.jpg")).toBe(true);
  });

  it("allows real covers", () => {
    expect(
      isLikelyInvalidCover("https://covers.openlibrary.org/b/id/1-L.jpg"),
    ).toBe(false);
  });
});
