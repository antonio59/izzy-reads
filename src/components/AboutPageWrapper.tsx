import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AboutPage from "./AboutPage";

// Default/fallback data (the original hardcoded content)
const defaultAboutData = {
  isPublished: true,
  bio: "Hi! I'm Izzy, and I absolutely LOVE reading! Books take me on amazing adventures to magical worlds, help me meet incredible characters, and teach me new things every day. Reading is my superpower!",
  favoriteGenres: ["Fantasy", "Adventure", "Mystery", "Realistic Fiction"],
  favoriteAuthors: [
    "J.K. Rowling",
    "R.J. Palacio",
    "Roald Dahl",
    "Rick Riordan",
  ],
  whyIRead:
    "I read because every book is a new adventure! Reading helps me imagine amazing worlds, understand different people, and learn about things I've never experienced. Plus, it's really fun!",
  funFacts: [
    "I can finish a 300-page book in one weekend!",
    "My favorite reading spot is curled up on the couch with my dog",
    "I've read the entire Harry Potter series 3 times",
    "I love recommending books to my friends",
  ],
  currentlyReading: "Percy Jackson & The Lightning Thief by Rick Riordan",
  readingGoals: [
    "Read 50 books this year",
    "Try a new genre every month",
    "Start a book club with my friends",
    "Write reviews for every book I read",
  ],
  achievements: [
    "Read 100 books",
    "Finished a series in one week",
    "Poetry Contest Winner",
    "Book Club Leader",
    "500 Pages in One Day",
  ],
};

export function AboutPageWrapper() {
  const profileData = useQuery(api.aboutProfile.get);

  // Use Convex data if available, otherwise use default
  const aboutData = profileData
    ? {
        isPublished: profileData.isPublished,
        bio: profileData.bio,
        favoriteGenres: profileData.favoriteGenres,
        favoriteAuthors: profileData.favoriteAuthors,
        whyIRead: profileData.whyIRead,
        funFacts: profileData.funFacts,
        currentlyReading: profileData.currentlyReading,
        readingGoals: profileData.readingGoals,
        achievements: profileData.achievements,
        profilePhoto: undefined, // Could add this to schema later
      }
    : defaultAboutData;

  return <AboutPage aboutData={aboutData} />;
}

export default AboutPageWrapper;
