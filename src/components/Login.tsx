import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Mail, LogIn, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, PasswordInput } from "./ui/Input";

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
          : "Unable to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-primary-50 to-accent-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-stone-800">
              Welcome back, Izzy!
            </h1>
          </Link>
          <p className="text-stone-500 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-500" />
            Ready to dive into your next adventure?
          </p>
        </div>

        {/* Login Form */}
        <Card variant="elevated" padding="lg" className="shadow-xl border border-cream-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="izzy@example.com"
              icon={<Mail className="w-5 h-5" />}
            />

            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your secret code"
            />

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
              variant="primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-stone-500 hover:text-primary-600 font-medium transition-colors"
            >
              Back to Izzy's Bookshelf
            </Link>
          </div>
        </Card>

        {/* Warm footer */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-stone-500">
            This is Izzy's personal space. Only she can sign in here.
          </p>
          <p className="text-xs text-stone-400 mt-1.5">
            Keep reading, keep dreaming
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
