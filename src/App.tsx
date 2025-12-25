import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

// Eager load public pages (most visited)
import PublicPortfolio from "./components/PublicPortfolio";
import PublicPoetry from "./components/PublicPoetry";
import PublicWishlist from "./components/PublicWishlist";
import PublicReviews from "./components/PublicReviews";
import AboutPage from "./components/AboutPage";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout, PublicLayout, AuthLayout } from "./components/Layout";
import { BookProvider } from "./contexts/BookContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy load auth pages
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));

// Lazy load admin/protected pages - NEW SIMPLIFIED STRUCTURE
const Dashboard = lazy(() => import("./components/Dashboard"));
const MyBooks = lazy(() => import("./components/MyBooks"));
const Create = lazy(() => import("./components/Create"));
const Progress = lazy(() => import("./components/Progress"));
const ParentDashboard = lazy(() => import("./components/ParentDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Legacy routes kept for direct access
const SeriesTracker = lazy(() => import("./components/SeriesTracker"));
const ExportData = lazy(() => import("./components/ExportData"));

// Loading spinner for lazy-loaded components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-stone-500 font-medium">Loading...</p>
    </div>
  </div>
);

// Static about data (would come from database in production)
const aboutData = {
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <BookProvider>
              <GamificationProvider>
                <Router>
                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/"
                      element={
                        <PublicLayout>
                          <PublicPortfolio />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <PublicLayout>
                          <AboutPage aboutData={aboutData} />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/poetry"
                      element={
                        <PublicLayout>
                          <PublicPoetry />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/my-wishlist"
                      element={
                        <PublicLayout>
                          <PublicWishlist />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/reviews"
                      element={
                        <PublicLayout>
                          <PublicReviews />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/reviews/:bookId"
                      element={
                        <PublicLayout>
                          <PublicReviews />
                        </PublicLayout>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <AuthLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Login />
                          </Suspense>
                        </AuthLayout>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <AuthLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Signup />
                          </Suspense>
                        </AuthLayout>
                      }
                    />

                    {/* NEW SIMPLIFIED PROTECTED ROUTES */}
                    <Route
                      path="/dashboard"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/books"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <MyBooks />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/create"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <Create />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/progress"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <Progress />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/parent"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <ParentDashboard />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />

                    {/* LEGACY REDIRECTS - keep old URLs working */}
                    <Route
                      path="/bookshelf"
                      element={<Navigate to="/books" replace />}
                    />
                    <Route
                      path="/wishlist"
                      element={<Navigate to="/books" replace />}
                    />
                    <Route
                      path="/poems"
                      element={<Navigate to="/create" replace />}
                    />
                    <Route
                      path="/blog"
                      element={<Navigate to="/create" replace />}
                    />
                    <Route
                      path="/achievements"
                      element={<Navigate to="/progress" replace />}
                    />
                    <Route
                      path="/goals"
                      element={<Navigate to="/progress" replace />}
                    />

                    {/* Keep series and export accessible but not in main nav */}
                    <Route
                      path="/series"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <SeriesTracker />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/export"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProtectedRoute>
                            <Layout>
                              <ExportData />
                            </Layout>
                          </ProtectedRoute>
                        </Suspense>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </GamificationProvider>
            </BookProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
