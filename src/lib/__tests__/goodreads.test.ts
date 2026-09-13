import { describe, it, expect } from "vitest";
import {
  parseGoodreadsCsv,
  planGoodreadsImport,
  coverUrlForIsbn,
  goodreadsSearchUrl,
} from "../goodreads";

const HEADER =
  "Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Owned Copies";

const sampleCsv = `${HEADER}
12345,"Wonder","R.J. Palacio","Palacio, R.J.",,"=",="9780375869020",5,4.44,Knopf,Hardcover,320,2012,2012,2024/03/15,2024/03/20,,,read,"Loved it so much!",,,1,0
12346,"The Wild Robot","Peter Brown","Brown, Peter",,"=",="9780316381994",0,4.30,Little Brown,Hardcover,279,2016,2016,,2024/05/01,,,to-read,,,,0,0
12347,"Pages & Co: Tilly and the Bookwanderers","Anna James","James, Anna",,"=",="9780008229870",4,4.10,HarperCollins,Paperback,368,2018,2018,,2024/06/01,,,currently-reading,,,,0,0
12348,"Book, With a Comma","Test Author","Author, Test",,"=",="9781234567890",3,3.90,Pub,Paperback,100,2020,2020,2024/01/02,2024/01/02,,,read,"Has a ""quoted"" word, and a comma",,,1,0`;

describe("parseGoodreadsCsv", () => {
  it("parses a Goodreads export into rows", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({
      title: "Wonder",
      author: "R.J. Palacio",
      isbn: "9780375869020",
      rating: 5,
      pageCount: 320,
      dateRead: "2024-03-15",
      dateAdded: "2024-03-20",
      shelf: "read",
      review: "Loved it so much!",
    });
  });

  it("maps exclusive shelves correctly", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    expect(rows.map((r) => r.shelf)).toEqual([
      "read",
      "to-read",
      "currently-reading",
      "read",
    ]);
  });

  it("ignores a zero rating (Goodreads uses 0 for unrated)", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    expect(rows[1].rating).toBeUndefined();
  });

  it("handles quoted commas and escaped quotes in reviews", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    expect(rows[3].title).toBe("Book, With a Comma");
    expect(rows[3].review).toBe('Has a "quoted" word, and a comma');
  });

  it("strips Goodreads' =\"...\" ISBN wrapper", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    expect(rows[0].isbn).toBe("9780375869020");
  });

  it("throws on a non-Goodreads CSV", () => {
    expect(() => parseGoodreadsCsv("a,b,c\n1,2,3")).toThrow(/Goodreads/);
  });

  it("returns an empty list for an empty file", () => {
    expect(parseGoodreadsCsv("")).toEqual([]);
  });
});

describe("planGoodreadsImport", () => {
  it("buckets rows by shelf and skips duplicates", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    const plan = planGoodreadsImport(rows, [
      { title: "Wonder", author: "R.J. Palacio", isbn: "9780375869020" },
    ]);
    expect(plan.finished.map((r) => r.title)).toEqual(["Book, With a Comma"]);
    expect(plan.reading.map((r) => r.title)).toEqual([
      "Pages & Co: Tilly and the Bookwanderers",
    ]);
    expect(plan.wishlist.map((r) => r.title)).toEqual(["The Wild Robot"]);
    expect(plan.skipped).toEqual([
      { title: "Wonder", reason: "Already on your shelf" },
    ]);
  });

  it("dedupes by title+author when ISBN is missing", () => {
    const rows = parseGoodreadsCsv(sampleCsv);
    const plan = planGoodreadsImport(rows, [
      { title: "  wonder ", author: "r.j. palacio" },
    ]);
    expect(plan.skipped[0].title).toBe("Wonder");
  });
});

describe("coverUrlForIsbn", () => {
  it("builds an Open Library cover URL", () => {
    expect(coverUrlForIsbn("9780375869020")).toBe(
      "https://covers.openlibrary.org/b/isbn/9780375869020-L.jpg",
    );
    expect(coverUrlForIsbn(undefined)).toBeUndefined();
  });
});

describe("goodreadsSearchUrl", () => {
  it("prefers ISBN search", () => {
    expect(
      goodreadsSearchUrl({
        title: "Wonder",
        author: "R.J. Palacio",
        isbn: "9780375869020",
      }),
    ).toBe("https://www.goodreads.com/search?q=9780375869020");
  });

  it("falls back to title+author search", () => {
    expect(
      goodreadsSearchUrl({ title: "Wonder", author: "R.J. Palacio" }),
    ).toBe("https://www.goodreads.com/search?q=Wonder%20R.J.%20Palacio");
  });
});
