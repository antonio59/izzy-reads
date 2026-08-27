import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AboutPage from "./AboutPage";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { Component, type ReactNode } from "react";

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

// Error boundary to catch Convex query errors and fall back to default data
interface ErrorBoundaryState {
  hasError: boolean;
}

class AboutErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silently fall back to default about page when Convex errors
  }

  render() {
    if (this.state.hasError) {
      // Fall back to default about page when Convex errors
      return <AboutPage aboutData={defaultAboutData} />;
    }
    return this.props.children;
  }
}

function AboutPageContent() {
  const profileData = useQuery(api.aboutProfile.get);

  // Show loading state while Convex is initializing
  if (profileData === undefined) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 pt-14 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-stone-100 animate-pulse mx-auto" />
            <div className="h-10 w-48 bg-stone-100 rounded-lg mx-auto animate-pulse" />
            <div className="h-4 w-80 max-w-full bg-stone-100 rounded mx-auto animate-pulse" />
            <div className="h-4 w-64 max-w-full bg-stone-100 rounded mx-auto animate-pulse" />
            <div className="h-11 w-40 bg-stone-100 rounded-xl mx-auto animate-pulse mt-2" />
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // If loaded but null (no profile saved) or not published, use default data
  // If loaded with data and published, use that data
  const aboutData =
    profileData !== null && profileData.isPublished
      ? {
          isPublished: true,
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

function AboutPageWrapper() {
  return (
    <AboutErrorBoundary>
      <AboutPageContent />
    </AboutErrorBoundary>
  );
}

export default AboutPageWrapper;
