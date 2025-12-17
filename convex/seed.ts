import { mutation } from "./_generated/server";
import { izzyBooks } from "../src/data/seedBooks";

// Seed database with Izzy's book collection
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data is already seeded
    const existingBooks = await ctx.db.query("books").take(1);
    if (existingBooks.length > 0) {
      console.log("Database already seeded, skipping...");
      return { message: "Already seeded" };
    }

    console.log("Seeding database with Izzy's books...");
    
    // Get first user (or create one)
    const existingUser = await ctx.db.query("users").first();
    if (!existingUser) {
      throw new Error("No user found. Please create a user first.");
    }

    // Transform seed data to match Convex schema
    const booksForConvex = izzyBooks.map(book => ({
      userId: existingUser._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      ageRating: book.ageRating,
      pageCount: book.pageCount,
      isRead: book.isRead,
      dateAdded: book.dateAdded,
      dateRead: book.dateRead || undefined,
      rating: book.rating || undefined,
      notes: book.notes || undefined,
    }));

    // Bulk insert all books
    const insertedIds = [];
    for (const book of booksForConvex) {
      const id = await ctx.db.insert("books", book);
      insertedIds.push(id);
    }

    console.log(`Seeded ${insertedIds.length} books to database`);
    return { 
      message: "Database seeded successfully",
      count: insertedIds.length
    };
  },
});