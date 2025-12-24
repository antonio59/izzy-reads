// Simple script to manually run Izzy's book migration
console.log("📚 Izzy's Book Migration Script");
console.log("");
console.log("🔍 Instructions:");
console.log(
  "1. Go to your staging site: https://izzysbookshelf.antoniosmith.xyz",
);
console.log("2. Sign up with email: izzy@izzyreads.com");
console.log("3. After signing in, copy and paste this into browser console:");
console.log("");
console.log("📋 Migration Code:");
console.log(`
// Run this in browser console to add Izzy's books
(async () => {
  const booksToAdd = [
    // Diary of a Wimpy Kid Series
    {
      title: "Diary of a Wimpy Kid",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141324906",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324906-L.jpg",
      isRead: true,
      dateAdded: "2024-01-01", // Use a consistent date for all books
      rating: 4,
      notes: "Greg is so funny! I love his drawings."
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
      dateAdded: new Date(Date.now() - 14 * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
      dateAdded: new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
      dateAdded: new Date(Date.now()).toISOString().split("T")[0],
    },
    {
      title: "The World's Worst Teachers",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 448,
      isbn: "9780008305796",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780008305796-L.jpg",
      isRead: true,
      dateAdded: new Date(Date.now()).toISOString().split("T")[0],
      rating: 4,
      notes: "David Walliams is hilarious! This book made me laugh so much."
    }
  ];

  for (const book of booksToAdd) {
    try {
      console.log(\`📖 Adding: \${book.title}\`);
      await window.convex.mutation('books:add', book);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    } catch (error) {
      console.error(\`❌ Failed to add \${book.title}:\`, error);
    }
  }
  
  console.log(\`✅ Done! Added \${booksToAdd.length} books to your staging database.\`);
})();
`);

console.log(
  "💡 This will add all of Izzy's favorite books with proper covers!",
);
console.log("");
console.log(
  "🌐 After running this, refresh the page to see the books in your database!",
);
