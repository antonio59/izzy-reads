import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Mail,
  UserPlus,
  AlertCircle,
  CheckCircle,
  User,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, PasswordInput } from "./ui/Input";

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
          <p className="text-stone-600 mt-2">Join the reading adventure!</p>
        </div>

        {/* Signup Form */}
        <Card variant="elevated" padding="lg" className="shadow-xl">
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

            <Input
              label="Your Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              autoComplete="name"
              icon={<User className="w-5 h-5" />}
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              icon={<Mail className="w-5 h-5" />}
            />

            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              hint="Must be at least 8 characters"
            />

            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              disabled={loading || success}
              fullWidth
              size="lg"
              variant="primary"
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
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
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
            <Link to="/" className="text-sm text-stone-500 hover:text-stone-700">
              ← Back to public portfolio
            </Link>
          </div>
        </Card>

        {/* Fun fact */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-stone-500">
            Join other young readers and start tracking your reading adventure!
            📚✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
