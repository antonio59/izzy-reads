import { BookSearchModal } from "./ui/BookSearchModal";
import type { Book } from "../types";

interface BookSearchProps {
  onAddBook: (book: Book) => void;
  onClose: () => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onAddBook, onClose }) => {
  const handleAddBook = (book: Omit<Book, "id">) => {
    // Generate a temporary ID - will be replaced by Convex
    const bookWithId: Book = {
      ...book,
      id: crypto.randomUUID(),
    };
    onAddBook(bookWithId);
  };

  return (
    <BookSearchModal
      isOpen={true}
      onClose={onClose}
      onAddBook={handleAddBook}
      mode="bookshelf"
    />
  );
};

export default BookSearch;
