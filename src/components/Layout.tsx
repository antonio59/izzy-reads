import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { PageTransition } from "./PageTransition";
import { ToastProvider } from "./ui/Toast";
import SkipToContent from "./SkipToContent";
import { AccessibleAnnouncerProvider } from "./AccessibleAnnouncer";
import AchievementNotification from "./AchievementNotification";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <AccessibleAnnouncerProvider>
      <ToastProvider>
        <div className="min-h-screen bg-hero pb-20 md:pb-0">
          <SkipToContent />
          <Navigation />
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <main
                id="main-content"
                className="container mx-auto px-4 py-6 md:py-8 max-w-7xl"
                tabIndex={-1}
                role="main"
                aria-label="Main content"
              >
                {children}
              </main>
            </PageTransition>
          </AnimatePresence>
          <AchievementNotification />
        </div>
      </ToastProvider>
    </AccessibleAnnouncerProvider>
  );
}

// Public layout without navigation (for login, signup, public portfolio)
interface PublicLayoutProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

export function PublicLayout({
  children,
  showBackground = true,
}: PublicLayoutProps) {
  const location = useLocation();

  return (
    <AccessibleAnnouncerProvider>
      <ToastProvider>
        <div
          className={`min-h-screen ${showBackground ? "bg-hero" : "bg-gray-50"}`}
        >
          <SkipToContent />
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <main
                id="main-content"
                tabIndex={-1}
                role="main"
                aria-label="Main content"
              >
                {children}
              </main>
            </PageTransition>
          </AnimatePresence>
        </div>
      </ToastProvider>
    </AccessibleAnnouncerProvider>
  );
}

// Auth layout for login/signup pages
interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AccessibleAnnouncerProvider>
      <ToastProvider>
        <div className="min-h-screen bg-hero flex items-center justify-center p-4">
          <SkipToContent />
          <div className="w-full max-w-md">
            <main
              id="main-content"
              tabIndex={-1}
              role="main"
              aria-label="Authentication"
            >
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AccessibleAnnouncerProvider>
  );
}

export default Layout;
