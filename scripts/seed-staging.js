// Simple seed script to populate Izzy's books in staging
import { izzyBooks } from "../src/data/seedBooks";

async function seedStaging() {
  console.log("📚 Starting database seed...");
  
  try {
    // Get first user
    const response = await fetch('/api/books/getAll');
    const existingBooks = await response.json();
    
    if (existingBooks.length > 0) {
      console.log("✅ Database already has books, skipping seed");
      return;
    }

    console.log(`🌱 Seeding ${izzyBooks.length} books to staging...`);
    
    // Use bulkAdd mutation to seed all books
    for (const book of izzyBooks) {
      const mutationResponse = await fetch('/api/books/bulkAdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-id-here', // You'll need actual user ID
          books: [book]
        })
      });
      await mutationResponse.json();
    }
    
    console.log("✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

// Run seed
seedStaging();