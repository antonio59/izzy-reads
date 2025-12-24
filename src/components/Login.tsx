import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Mail, Lock, LogIn, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isNoAccountError =
    error.toLowerCase().includes("no account") ||
    error.toLowerCase().includes("sign up");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Izzy's Bookshelf
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">
            Welcome back! Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                className={`rounded-lg p-4 flex items-start gap-3 ${
                  isNoAccountError
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-red-50 border border-red-200"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isNoAccountError ? (
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-sm ${isNoAccountError ? "text-blue-800" : "text-red-800"}`}
                  >
                    {error}
                  </p>
                  {isNoAccountError && (
                    <Link
                      to="/signup"
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-block"
                    >
                      Create an account now →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to public portfolio
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-500">
            First time here?{" "}
            <Link to="/signup" className="text-purple-600 font-medium">
              Create your account
            </Link>{" "}
            to start your reading adventure!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
