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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500 font-medium">Loading...</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // If loaded but null (no profile saved), use default data
  // If loaded with data, use that data
  const aboutData =
    profileData !== null
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

export function AboutPageWrapper() {
  return (
    <AboutErrorBoundary>
      <AboutPageContent />
    </AboutErrorBoundary>
  );
}

export default AboutPageWrapper;
