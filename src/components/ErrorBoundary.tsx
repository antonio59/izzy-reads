import { Component, useId, useMemo, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Card } from "./ui/Card";

const funMessages = [
  { emoji: "📖", message: "This page got a paper cut" },
  { emoji: "📚", message: "We lost our place in the book" },
  { emoji: "🔖", message: "Something slipped off the shelf" },
  { emoji: "📝", message: "A page didn't load quite right" },
  { emoji: "📕", message: "That chapter didn't open" },
];

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          onTryAgain={this.handleTryAgain}
        />
      );
    }

    return this.props.children;
  }
}

// Fun error fallback component
function ErrorFallback({
  onReload,
  onGoHome,
  onTryAgain,
}: {
  onReload: () => void;
  onGoHome: () => void;
  onTryAgain: () => void;
}) {
  const id = useId();
  const randomMessage = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % funMessages.length;
    return funMessages[index];
  }, [id]);

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <Card
        variant="elevated"
        padding="lg"
        className="max-w-md w-full text-center ring-1 ring-cream-300"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center ring-1 ring-primary-200">
            <AlertTriangle className="w-10 h-10 text-primary-600" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl" aria-hidden>
            {randomMessage.emoji}
          </span>
        </div>

        <h1 className="text-2xl font-display font-bold text-stone-800 mb-2">
          {randomMessage.message}
        </h1>

        <p className="text-stone-500 mb-8">
          Don't worry — let's get you back to the shelf.
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={onTryAgain}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary-600/20"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <motion.button
            onClick={onReload}
            className="w-full bg-white text-stone-700 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cream-50 border border-cream-300 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </motion.button>

          <motion.button
            onClick={onGoHome}
            className="w-full text-primary-600 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>
        </div>

        <p className="mt-8 text-sm text-stone-400">
          Tip: a quick reload often clears it up.
        </p>
      </Card>
    </div>
  );
}

export default ErrorBoundary;
