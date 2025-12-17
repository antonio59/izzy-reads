/**
 * Izzy's Book Collection - Seed Data
 *
 * Books from Izzy's bookshelf to be added to her reading portfolio.
 * These are books she has read (isRead: true) but may not have reviews yet.
 */

export interface SeedBook {
  title: string;
  author: string;
  genre: string;
  ageRating: string;
  pageCount?: number;
  isbn?: string;
  coverUrl?: string;
  isRead: boolean;
  dateAdded: string;
  dateRead?: string;
  rating?: number;
  notes?: string;
}

// Today's date for dateAdded
const today = new Date().toISOString().split("T")[0];

export const izzyBooks: SeedBook[] = [
  // Diary of a Wimpy Kid Series - Jeff Kinney
  {
    title: "Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 217,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Diary of a Wimpy Kid: Rodrick Rules",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 217,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Diary of a Wimpy Kid: The Last Straw",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 217,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Diary of a Wimpy Kid: Dog Days",
    author: "Jeff Kinney",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 217,
    isRead: true,
    dateAdded: today,
  },

  // Tom Gates Series - Liz Pichon
  {
    title: "Tom Gates: Dog Zombies Rule",
    author: "Liz Pichon",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 250,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Tom Gates: Top of the Class (Nearly)",
    author: "Liz Pichon",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 250,
    isRead: true,
    dateAdded: today,
  },

  // Bunny vs Monkey - Jamie Smart
  {
    title: "Bunny vs Monkey",
    author: "Jamie Smart",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 208,
    isbn: "9781788451420",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781788451420-L.jpg",
    isRead: true,
    dateAdded: today,
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
    dateAdded: today,
  },

  // Visual Dictionary
  {
    title: "Visual English Italiano-Inglese",
    author: "DK Publishing",
    genre: "Non-Fiction",
    ageRating: "All Ages",
    pageCount: 360,
    isRead: true,
    dateAdded: today,
  },

  // Geekhood - Andy Robb
  {
    title: "Geekhood: Close Encounters of the Girl Kind",
    author: "Andy Robb",
    genre: "Fiction",
    ageRating: "10-14",
    pageCount: 320,
    isbn: "9780192794252",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780192794252-L.jpg",
    isRead: true,
    dateAdded: today,
  },

  // David Walliams Books
  {
    title: "The World's Worst Teachers",
    author: "David Walliams",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 448,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Billionaire Boy",
    author: "David Walliams",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 277,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Gangsta Granny",
    author: "David Walliams",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 295,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "The Boy in the Dress",
    author: "David Walliams",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 227,
    isRead: true,
    dateAdded: today,
  },
  {
    title: "Ratburger",
    author: "David Walliams",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 304,
    isRead: true,
    dateAdded: today,
  },

  // Marcus Rashford
  {
    title: "You Are a Champion",
    author: "Marcus Rashford",
    genre: "Non-Fiction",
    ageRating: "8-12",
    pageCount: 192,
    isbn: "9781529068177",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781529068177-L.jpg",
    isRead: true,
    dateAdded: today,
    rating: 5,
    notes: "Such an inspiring book! Marcus Rashford is a great role model.",
  },

  // Treehouse Series - Andy Griffiths & Terry Denton
  {
    title: "The 13-Storey Treehouse",
    author: "Andy Griffiths",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 240,
    isbn: "9781407143231",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781407143231-L.jpg",
    isRead: true,
    dateAdded: today,
  },
  {
    title: "The 26-Storey Treehouse",
    author: "Andy Griffiths",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 288,
    isbn: "9781407148328",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781407148328-L.jpg",
    isRead: true,
    dateAdded: today,
  },
  {
    title: "The 39-Storey Treehouse",
    author: "Andy Griffiths",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 384,
    isbn: "9781407144385",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781407144385-L.jpg",
    isRead: true,
    dateAdded: today,
  },
  {
    title: "The 78-Storey Treehouse",
    author: "Andy Griffiths",
    genre: "Fiction",
    ageRating: "7-10",
    pageCount: 384,
    isbn: "9781407146399",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781407146399-L.jpg",
    isRead: true,
    dateAdded: today,
  },

  // Fairy Tales
  {
    title: "Fairy Tales",
    author: "Hans Christian Andersen",
    genre: "Fantasy",
    ageRating: "All Ages",
    pageCount: 200,
    isbn: "9780141329017",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141329017-L.jpg",
    isRead: true,
    dateAdded: today,
  },

  // Jacqueline Wilson (if visible)
  {
    title: "My Family and Other Embarrassments",
    author: "Yasmin Khoury",
    genre: "Fiction",
    ageRating: "8-12",
    pageCount: 288,
    isRead: true,
    dateAdded: today,
  },
];

export default izzyBooks;
