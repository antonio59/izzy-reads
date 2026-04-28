/* eslint-disable react-refresh/only-export-components */
import {
  useState,
  createContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";

interface AnnouncerContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(
  undefined,
);

interface AnnouncerProviderProps {
  children: ReactNode;
}

/**
 * Provides an accessible way to announce dynamic content changes to screen readers.
 * Uses ARIA live regions to communicate updates without visual change.
 */
export const AccessibleAnnouncerProvider: React.FC<AnnouncerProviderProps> = ({
  children,
}) => {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (priority === "assertive") {
        setAssertiveMessage(message);
        // Clear after announcement
        setTimeout(() => setAssertiveMessage(""), 1000);
      } else {
        setPoliteMessage(message);
        // Clear after announcement
        setTimeout(() => setPoliteMessage(""), 1000);
      }
    },
    [],
  );

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}

      {/* Polite announcements - for non-urgent updates */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Assertive announcements - for urgent/important updates */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};




