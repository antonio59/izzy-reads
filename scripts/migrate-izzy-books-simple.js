// Simple script to migrate Izzy's books to staging database
console.log("📚 Izzy's Books Migration Script");
console.log("");
console.log("🔍 Instructions:");
console.log(
  "1. Go to your staging site: https://izzysbookshelf.antoniosmith.xyz",
);
console.log("2. Sign in with email: izzy@izzyreads.com");
console.log("3. Open browser console and copy-paste this entire script");
console.log("");

// Migration data - all books with proper covers
const izzyBooks = [
  {
    title: "Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 217,
    isbn: "9780141324906",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324906-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
    rating: 4,
    notes: "Greg is so funny! I love his drawings.",
  },
  {
    title: "Diary of a Wimpy Kid: Rodrick Rules",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 224,
    isbn: "9780141324913",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324913-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
    rating: 4,
  },
  {
    title: "Geekhood: Close Encounters of the Girl Kind",
    author: "Andy Robb",
    genre: "Fiction",
    ageRating: "10-14",
    pageCount: 320,
    isbn: "9780192794252",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780192794252-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
    rating: 4,
  },
  {
    title: "Bunny vs Monkey",
    author: "Jamie Smart",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 208,
    isbn: "9781788451420",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781788451420-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
  },
  {
    title: "Dork Diaries",
    author: "Rachel Renee Russell",
    genre: "Fiction",
    ageRating: "9-12",
    pageCount: 282,
    isbn: "9781847387127",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781847387127-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
    rating: 5,
    notes: "So funny! I love Nikki and her diary entries.",
  },
  {
    title: "You Are a Champion",
    author: "Marcus Rashford",
    genre: "Non-Fiction",
    ageRating: "8-12",
    pageCount: 192,
    isbn: "9781529068177",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781529068177-L.jpg",
    isRead: true,
    dateAdded: "2024-01-01",
    rating: 5,
    notes: "Such an inspiring book! Marcus Rashford is a great role model.",
  },
];

// Migration function
async function migrateBooks() {
  console.log(`📚 Starting migration of ${izzyBooks.length} books...`);

  try {
    let successCount = 0;
    for (const book of izzyBooks) {
      try {
        await window.convex.mutation("books:add", book);
        console.log(`✅ Added: ${book.title}`);
        successCount++;
        // Rate limiting - wait between books
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Failed to add ${book.title}:`, error);
      }
    }

    console.log(
      `🎉 Migration complete! Added ${successCount} of ${izzyBooks.length} books`,
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Auto-run migration
migrateBooks();
