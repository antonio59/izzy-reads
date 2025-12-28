import { BookSearchModal, type BookDestination } from "./ui/BookSearchModal";
import type { Book } from "../types";

interface BookSearchProps {
  onAddBook: (book: Book, destination: BookDestination) => void;
  onClose: () => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onAddBook, onClose }) => {
  const handleAddBook = (
    book: Omit<Book, "id">,
    destination: BookDestination,
  ) => {
    // Generate a temporary ID - will be replaced by Convex
    const bookWithId: Book = {
      ...book,
      id: crypto.randomUUID(),
    };
    onAddBook(bookWithId, destination);
  };

  return (
    <BookSearchModal
      isOpen={true}
      onClose={onClose}
      onAddBook={handleAddBook}
    />
  );
};

export default BookSearch;
