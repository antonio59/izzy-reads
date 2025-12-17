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
    
    // For seeding, we need to skip authentication and use a system approach
    // This creates both the auth user and profile
    const newUserId = await ctx.db.insert("users", {
      email: "izzy@izzyreads.com",
    });

    // Create profile for the user
    await ctx.db.insert("userProfiles", {
      userId: newUserId,
      name: "Izzy",
      age: 10,
      isParent: false,
      theme: "colorful",
    });
    
    console.log("Created user with ID:", newUserId);

    // Transform seed data to match Convex schema
    const booksForConvex = izzyBooks.map(book => ({
      userId: newUserId,
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