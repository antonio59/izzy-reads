import { Component, useId, useMemo, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

const funMessages = [
  { emoji: "📖", message: "Oops! This page got a paper cut!" },
  { emoji: "🔮", message: "Even magic has its limits!" },
  { emoji: "🐛", message: "A tiny bug is causing trouble!" },
  { emoji: "🌪️", message: "A wild error appeared!" },
  { emoji: "🎭", message: "Plot twist: Something went wrong!" },
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated warning icon */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <motion.span
            className="absolute -top-2 -right-2 text-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {randomMessage.emoji}
          </motion.span>
        </motion.div>

        <h1 className="text-2xl font-display font-bold text-stone-800 mb-2">
          {randomMessage.message}
        </h1>

        <p className="text-stone-500 mb-8">
          Don't worry, even the best stories have unexpected chapters. Let's get
          you back on track!
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={onTryAgain}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <motion.button
            onClick={onReload}
            className="w-full bg-stone-100 text-stone-700 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </motion.button>

          <motion.button
            onClick={onGoHome}
            className="w-full text-purple-600 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>
        </div>

        {/* Fun footer */}
        <motion.p
          className="mt-8 text-sm text-stone-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Tip: Sometimes turning it off and on again really does work!
        </motion.p>
      </motion.div>
    </div>
  );
}

export default ErrorBoundary;
