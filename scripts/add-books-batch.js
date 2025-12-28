/**
 * Add Books Batch Script
 *
 * This script adds a batch of books to Izzy's bookshelf.
 *
 * Usage:
 * 1. Go to https://izzysbookshelf.com
 * 2. Sign in as Izzy (the main user account)
 * 3. Open browser console (F12 → Console)
 * 4. Copy and paste the code below
 */

console.log("📚 Izzy's Bookshelf - Add Books Script");
console.log("======================================");
console.log("");
console.log(
  "Copy and paste the following code in browser console while signed in:",
);
console.log("");

const addBooksCode = `
// Add Books to Izzy's Bookshelf - Paste this in browser console while signed in

(async () => {
  const books = [
    // Diary of a Wimpy Kid Series - Jeff Kinney (Full Series)
    {
      title: "Diary of a Wimpy Kid",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141324906",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324906-L.jpg",
      isRead: true,
      rating: 5,
      notes: "The one that started it all! Greg Heffley is hilarious.",
      dateAdded: "2024-01-15",
      dateRead: "2024-01"
    },
    {
      title: "Diary of a Wimpy Kid: Rodrick Rules",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141324913",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324913-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-02-10",
      dateRead: "2024-02"
    },
    {
      title: "Diary of a Wimpy Kid: The Last Straw",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141324920",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324920-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-03-05",
      dateRead: "2024-03"
    },
    {
      title: "Diary of a Wimpy Kid: Dog Days",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141331973",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141331973-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-04-01",
      dateRead: "2024-04"
    },
    {
      title: "Diary of a Wimpy Kid: The Ugly Truth",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141340821",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141340821-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-05-15",
      dateRead: "2024-05"
    },
    {
      title: "Diary of a Wimpy Kid: Cabin Fever",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 224,
      isbn: "9780141341880",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141341880-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-06-01",
      dateRead: "2024-06"
    },
    {
      title: "Diary of a Wimpy Kid: The Third Wheel",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141345741",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141345741-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-07-01",
      dateRead: "2024-07"
    },
    {
      title: "Diary of a Wimpy Kid: Hard Luck",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141350677",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141350677-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-08-01",
      dateRead: "2024-08"
    },
    {
      title: "Diary of a Wimpy Kid: The Long Haul",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141354224",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141354224-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Road trip chaos!",
      dateAdded: "2024-09-01",
      dateRead: "2024-09"
    },
    {
      title: "Diary of a Wimpy Kid: Old School",
      author: "Jeff Kinney",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 217,
      isbn: "9780141365091",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141365091-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-10-01",
      dateRead: "2024-10"
    },

    // Tom Gates - Liz Pichon
    {
      title: "Tom Gates: Dog Zombies Rule (For Now)",
      author: "Liz Pichon",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 400,
      isbn: "9781407143323",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781407143323-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Tom's band is awesome!",
      dateAdded: "2024-06-01",
      dateRead: "2024-06"
    },
    {
      title: "Tom Gates: Top of the Class (Nearly)",
      author: "Liz Pichon",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 384,
      isbn: "9781407148267",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781407148267-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-07-01",
      dateRead: "2024-07"
    },

    // Bunny vs Monkey - Jamie Smart
    {
      title: "Bunny vs Monkey",
      author: "Jamie Smart",
      genre: "Graphic Novel",
      ageRating: "7+",
      pageCount: 256,
      isbn: "9781910200025",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781910200025-L.jpg",
      isRead: true,
      rating: 5,
      notes: "So funny! Monkey is crazy!",
      dateAdded: "2024-05-01",
      dateRead: "2024-05"
    },

    // Dork Diaries - Rachel Renee Russell
    {
      title: "Dork Diaries",
      author: "Rachel Renee Russell",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 282,
      isbn: "9781416980063",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781416980063-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Nikki is so relatable!",
      dateAdded: "2024-03-01",
      dateRead: "2024-03"
    },

    // Geekhood - Andy Robb
    {
      title: "Geekhood: Close Encounters of the Girl Kind",
      author: "Andy Robb",
      genre: "Humor",
      ageRating: "10+",
      pageCount: 320,
      isbn: "9781847152794",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781847152794-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-08-01",
      dateRead: "2024-08"
    },

    // Michael Morpurgo
    {
      title: "My Family and Other Animals",
      author: "Gerald Durrell",
      genre: "Non-Fiction",
      ageRating: "10+",
      pageCount: 320,
      isbn: "9780141325453",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141325453-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Funny stories about animals!",
      dateAdded: "2024-04-01",
      dateRead: "2024-04"
    },

    // David Walliams Books
    {
      title: "The World's Worst Teachers",
      author: "David Walliams",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 448,
      isbn: "9780008305789",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780008305789-L.jpg",
      isRead: true,
      rating: 5,
      notes: "So many crazy teachers!",
      dateAdded: "2024-02-01",
      dateRead: "2024-02"
    },
    {
      title: "Billionaire Boy",
      author: "David Walliams",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 277,
      isbn: "9780007371082",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371082-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Money can't buy friends!",
      dateAdded: "2024-01-01",
      dateRead: "2024-01"
    },
    {
      title: "Gangsta Granny",
      author: "David Walliams",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 296,
      isbn: "9780007371464",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371464-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Granny is not who she seems!",
      dateAdded: "2024-03-15",
      dateRead: "2024-03"
    },
    {
      title: "The Boy in the Dress",
      author: "David Walliams",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 240,
      isbn: "9780007279043",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007279043-L.jpg",
      isRead: true,
      rating: 4,
      dateAdded: "2024-04-15",
      dateRead: "2024-04"
    },
    {
      title: "Ratburger",
      author: "David Walliams",
      genre: "Humor",
      ageRating: "8+",
      pageCount: 304,
      isbn: "9780007453535",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780007453535-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Burt is so gross!",
      dateAdded: "2024-05-15",
      dateRead: "2024-05"
    },

    // Marcus Rashford
    {
      title: "You Are a Champion: How to Be the Best You Can Be",
      author: "Marcus Rashford",
      genre: "Non-Fiction",
      ageRating: "8+",
      pageCount: 224,
      isbn: "9781529068177",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781529068177-L.jpg",
      isRead: true,
      rating: 5,
      notes: "Really inspiring!",
      dateAdded: "2024-06-15",
      dateRead: "2024-06"
    },

    // Treehouse Series - Andy Griffiths & Terry Denton
    {
      title: "The 13-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Humor",
      ageRating: "7+",
      pageCount: 256,
      isbn: "9781447279785",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279785-L.jpg",
      isRead: true,
      rating: 5,
      notes: "The treehouse is amazing!",
      dateAdded: "2024-07-01",
      dateRead: "2024-07"
    },
    {
      title: "The 26-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Humor",
      ageRating: "7+",
      pageCount: 272,
      isbn: "9781447279808",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279808-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-08-01",
      dateRead: "2024-08"
    },
    {
      title: "The 39-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Humor",
      ageRating: "7+",
      pageCount: 336,
      isbn: "9781447281580",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781447281580-L.jpg",
      isRead: true,
      rating: 5,
      dateAdded: "2024-09-01",
      dateRead: "2024-09"
    },
    {
      title: "The 78-Storey Treehouse",
      author: "Andy Griffiths",
      genre: "Humor",
      ageRating: "7+",
      pageCount: 384,
      isbn: "9781509833757",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781509833757-L.jpg",
      isRead: true,
      rating: 5,
      notes: "It keeps getting bigger!",
      dateAdded: "2024-10-01",
      dateRead: "2024-10"
    },

    // Fairy Tales
    {
      title: "Grimms' Fairy Tales",
      author: "Brothers Grimm",
      genre: "Fantasy",
      ageRating: "8+",
      pageCount: 480,
      isbn: "9780141331201",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141331201-L.jpg",
      isRead: true,
      rating: 4,
      notes: "Classic stories!",
      dateAdded: "2024-11-01",
      dateRead: "2024-11"
    }
  ];

  console.log("📚 Adding " + books.length + " books to your bookshelf...");
  console.log("");

  let added = 0;
  let errors = 0;

  for (const book of books) {
    try {
      // Use the Convex client from the page
      const convex = window.__CONVEX_CLIENT__;
      if (!convex) {
        console.error("Convex client not found. Make sure you're on izzysbookshelf.com and signed in.");
        return;
      }

      await convex.mutation("books:add", book);
      console.log("✅ Added: " + book.title);
      added++;
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error("❌ Failed to add: " + book.title, e.message);
      errors++;
    }
  }

  console.log("");
  console.log("========================================");
  console.log("✅ Successfully added: " + added + " books");
  if (errors > 0) {
    console.log("❌ Failed: " + errors + " books");
  }
  console.log("Refresh the page to see your new books!");
})();
`;

console.log(addBooksCode);
