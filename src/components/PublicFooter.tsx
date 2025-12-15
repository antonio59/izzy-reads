import { Link } from "react-router-dom";
import { BookLogo } from "./PublicNav";

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-cream-300 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookLogo className="w-6 h-6 text-primary-500" />
            <span className="font-display font-bold text-stone-700">
              Izzy's Corner
            </span>
          </div>
          <p className="text-stone-500 text-sm">
            Keep reading, keep dreaming ✨
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-stone-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Books
            </Link>
            <Link
              to="/reviews"
              className="text-stone-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Reviews
            </Link>
            <Link
              to="/poetry"
              className="text-stone-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Poems
            </Link>
            <Link
              to="/my-wishlist"
              className="text-stone-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/about"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              About Izzy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
