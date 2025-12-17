// Seed staging database with Izzy's books using existing bulkAdd mutation
import { izzyBooks } from "../src/data/seedBooks";

// Transform to format expected by bulkAdd
const booksForSeeding = izzyBooks.map(book => ({
  title: book.title,
  author: book.author,
  genre: book.genre,
  ageRating: book.ageRating,
  pageCount: book.pageCount,
  isRead: book.isRead,
  dateAdded: book.dateAdded,
  dateRead: book.dateRead,
  rating: book.rating,
  notes: book.notes,
}));

console.log(`📚 Prepared ${booksForSeeding.length} books for seeding`);
console.log("First book:", JSON.stringify(booksForSeeding[0], null, 2));

export default booksForSeeding;