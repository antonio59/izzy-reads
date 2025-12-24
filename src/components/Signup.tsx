import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  CheckCircle,
  User,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isAccountExistsError =
    error.toLowerCase().includes("already exists") ||
    error.toLowerCase().includes("sign in");

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
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Izzy's Bookshelf
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Join the reading adventure!</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                className={`rounded-lg p-4 flex items-start gap-3 ${
                  isAccountExistsError
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-red-50 border border-red-200"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isAccountExistsError ? (
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-sm ${isAccountExistsError ? "text-blue-800" : "text-red-800"}`}
                  >
                    {error}
                  </p>
                  {isAccountExistsError && (
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-block"
                    >
                      Sign in to your account →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Account created successfully! Redirecting to your dashboard...
                </p>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="What should we call you?"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  autoComplete="email"
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: loading || success ? 1 : 1.02 }}
              whileTap={{ scale: loading || success ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Success!
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to public portfolio
            </Link>
          </div>
        </div>

        {/* Fun fact */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-500">
            Join other young readers and start tracking your reading adventure!
            📚✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
