/**
 * Seed Production Books Script
 *
 * This script adds Izzy's book collection to the production database.
 *
 * Usage:
 * 1. Go to https://izzysbookshelf.com
 * 2. Sign in as Izzy (the main user account)
 * 3. Open browser console (F12 → Console)
 * 4. Copy and paste the ENTIRE content below (starting from the books array)
 */

console.log("📚 Izzy's Bookshelf - Production Book Seeder");
console.log("============================================");
console.log("");
console.log("Instructions:");
console.log("1. Sign in at https://izzysbookshelf.com");
console.log("2. Open browser console (F12 → Console)");
console.log("3. Paste the following code:");
console.log("");
console.log("─".repeat(50));
console.log("");

const seedCode = `
// Izzy's Book Collection - Paste this in browser console while signed in

(async () => {
  const books = [
    // Diary of a Wimpy Kid Series - Jeff Kinney
    {
      title: "Diary of a Wimpy Kid",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141324906",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324906-L.jpg",
      isRead: true,
      rating: 5,
      notes: "The one that started it all! Greg Heffley is so funny.",
      dateAdded: "2024-01-15"
    },
    {
      title: "Diary of a Wimpy Kid: Rodrick Rules",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141324913",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324913-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Rodrick is hilarious!",
      dateAdded: "2024-02-10"
    },
    {
      title: "Diary of a Wimpy Kid: The Last Straw",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141324920",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324920-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-03-05"
    },
    {
      title: "Diary of a Wimpy Kid: Dog Days",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141331973",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141331973-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Summer holidays are the best!",
      dateAdded: "2024-04-01"
    },
    {
      title: "Diary of a Wimpy Kid: The Ugly Truth",
      author: "Jeff Kinney",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 217,
      isbn: "9780141340821",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141340821-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-05-15"
    },
    
    // Tom Gates Series - Liz Pichon
    {
      title: "Tom Gates: Dog Zombies Rule (For Now)",
      author: "Liz Pichon",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 400,
      isbn: "9781407143231",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781407143231-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Love the doodles! Dog Zombies is the best band name ever.",
      dateAdded: "2024-03-20"
    },
    {
      title: "Tom Gates: Top of the Class (Nearly)",
      author: "Liz Pichon",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 384,
      isbn: "9781407148465",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781407148465-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Tom is always getting into trouble!",
      dateAdded: "2024-04-10"
    },
    
    // Jamie Smart
    {
      title: "Bunny vs Monkey",
      author: "Jamie Smart",
      genre: "Fiction",
      ageRating: "7-10",
      pageCount: 208,
      isbn: "9781788451420",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781788451420-L.jpg",
      isRead: true,
      rating: 5,
      notes: "So silly and fun! The pictures are amazing.",
      dateAdded: "2024-02-28"
    },
    
    // Dork Diaries - Rachel Renee Russell
    {
      title: "Dork Diaries",
      author: "Rachel Renee Russell",
      genre: "Fiction",
      ageRating: "9-12",
      pageCount: 282,
      isbn: "9781847387127",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781847387127-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Nikki Maxwell is so relatable! Love her diary entries.",
      dateAdded: "2024-01-20"
    },
    
    // Andy Robb
    {
      title: "Geekhood: Close Encounters of the Girl Kind",
      author: "Andy Robb",
      genre: "Fiction",
      ageRating: "10-14",
      pageCount: 320,
      isbn: "9780192794252",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780192794252-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Really funny book about being a geek!",
      dateAdded: "2024-05-01"
    },
    
    // David Baddiel
    {
      title: "My Family and Other Children",
      author: "David Baddiel",
      genre: "Fiction",
      ageRating: "9-12",
      pageCount: 352,
      isbn: "9780007554485",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007554485-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Family chaos is always entertaining!",
      dateAdded: "2024-06-15"
    },
    
    // David Walliams Books
    {
      title: "The World's Worst Teachers",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 448,
      isbn: "9780008305796",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780008305796-L.jpg",
      isRead: true,
      rating: 5,
      notes: "David Walliams is hilarious! These teachers are SO bad.",
      dateAdded: "2024-03-01"
    },
    {
      title: "Billionaire Boy",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 288,
      isbn: "9780007371082",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371082-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Money can't buy friends! Great message.",
      dateAdded: "2024-02-01"
    },
    {
      title: "Gangsta Granny",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 296,
      isbn: "9780007371464",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371464-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Grannies are cool! Never judge a book by its cover.",
      dateAdded: "2024-01-10"
    },
    {
      title: "The Boy in the Dress",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 240,
      isbn: "9780007279043",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007279043-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Be yourself! Such an important story.",
      dateAdded: "2024-04-20"
    },
    {
      title: "Ratburger",
      author: "David Walliams",
      genre: "Fiction",
      ageRating: "8-12",
      pageCount: 304,
      isbn: "9780007453528",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007453528-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Gross but funny! Poor little rat.",
      dateAdded: "2024-05-20"
    },
    
    // Marcus Rashford
    {
      title: "You Are a Champion: How to Be the Best You Can Be",
      author: "Marcus Rashford",
      genre: "Non-Fiction",
      ageRating: "8-12",
      pageCount: 192,
      isbn: "9781529068177",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781529068177-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Marcus Rashford is such an inspiration! This book motivates me to be my best.",
      dateAdded: "2024-06-01"
    },
    
    // Andy Griffiths - Treehouse Series
    {
      title: "The 13-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Fiction",
      ageRating: "7-10",
      pageCount: 272,
      isbn: "9781447279785",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279785-L.jpg",
      isRead: true,
      rating: 5,
      notes: "I want to live in this treehouse! So many cool things.",
      dateAdded: "2024-02-15"
    },
    {
      title: "The 26-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Fiction",
      ageRating: "7-10",
      pageCount: 272,
      isbn: "9781447279808",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279808-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Even more floors, even more fun!",
      dateAdded: "2024-03-10"
    },
    {
      title: "The 39-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Fiction",
      ageRating: "7-10",
      pageCount: 336,
      isbn: "9781447281580",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447281580-L.jpg",
      isRead: true,
      rating: 5,
      notes: "The treehouse keeps growing!",
      dateAdded: "2024-04-05"
    },
    {
      title: "The 78-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Fiction",
      ageRating: "7-10",
      pageCount: 384,
      isbn: "9781509833771",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781509833771-L.jpg",
      isRead: true,
      rating: 5,
      notes: "How tall can it get?! Love these books.",
      dateAdded: "2024-05-10"
    },
    
    // Classic Fairy Tales
    {
      title: "Ladybird Tales: Classic Stories",
      author: "Various",
      genre: "Fantasy",
      ageRating: "5-8",
      pageCount: 160,
      isbn: "9780723297482",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780723297482-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Classic fairy tales never get old!",
      dateAdded: "2024-01-05"
    }
  ];

  console.log("📚 Adding " + books.length + " books to your bookshelf...");
  console.log("");

  let successCount = 0;
  let errorCount = 0;

  for (const book of books) {
    try {
      // The app should have a global convex client or you can use the mutation directly
      // This assumes you're on the dashboard page where mutations are available
      console.log("📖 Adding: " + book.title);
      
      // Try to use the app's add book function
      if (window.__CONVEX_CLIENT__) {
        await window.__CONVEX_CLIENT__.mutation("books:add", book);
        successCount++;
      } else {
        console.log("   ⚠️ Convex client not found. Please add manually.");
        errorCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error("   ❌ Failed: " + error.message);
      errorCount++;
    }
  }

  console.log("");
  console.log("════════════════════════════════════════");
  console.log("✅ Successfully added: " + successCount + " books");
  if (errorCount > 0) {
    console.log("❌ Failed: " + errorCount + " books");
  }
  console.log("════════════════════════════════════════");
  console.log("");
  console.log("🎉 Done! Refresh the page to see your books.");
})();
`;

console.log(seedCode);
