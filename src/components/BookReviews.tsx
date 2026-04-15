import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Star, Calendar, Quote, ArrowRight } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { FadeIn, StaggerContainer, StaggerItem } from './PageTransition'

const BookReviews: React.FC = () => {
    const { books } = useBooks()

    const reviews = books
        .filter(book => book.isRead && (book.review || book.rating))
        .sort((a, b) => new Date(b.dateRead || '').getTime() - new Date(a.dateRead || '').getTime())

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <FadeIn>
                <div className="text-center py-8">
                    <h1 className="text-4xl font-display font-bold text-stone-900 mb-3 flex items-center justify-center gap-3">
                        <BookOpen className="w-10 h-10 text-primary-500" />
                        My Reading Journal
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                        A collection of my thoughts, adventures, and discoveries from the books I've read. 📖✨
                    </p>
                </div>
            </FadeIn>

            {reviews.length > 0 ? (
                <StaggerContainer className="space-y-8">
                    {reviews.map((book) => (
                        <StaggerItem key={book.id}>
                            <Card className="overflow-hidden border-2 border-stone-100 hover:border-primary-200 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    {/* Book Cover / Sidebar */}
                                    <div className="md:w-48 lg:w-56 flex-shrink-0 bg-stone-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-100">
                                        <div className="w-32 aspect-[2/3] relative shadow-lg rounded-lg overflow-hidden mb-4 transform hover:scale-105 transition-transform duration-300">
                                            {book.coverUrl ? (
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                                                    <BookOpen className="w-10 h-10 text-primary-300" />
                                                </div>
                                            )}
                                        </div>
                                        {book.rating && (
                                            <div className="flex gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= book.rating!
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-stone-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {book.dateRead && (
                                            <div className="text-xs text-stone-500 flex items-center gap-1 mt-auto">
                                                <Calendar className="w-3 h-3" />
                                                Read on {new Date(book.dateRead).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-display font-bold text-stone-900 mb-1">
                                                        {book.title}
                                                    </h2>
                                                    <p className="text-stone-600 font-medium">{book.author}</p>
                                                </div>
                                                <Badge variant="primary" className="hidden sm:inline-flex">
                                                    {book.genre}
                                                </Badge>
                                            </div>
                                            <div className="sm:hidden mt-2">
                                                <Badge variant="primary">{book.genre}</Badge>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            {book.review ? (
                                                <div className="prose prose-lg text-stone-700 font-serif leading-relaxed">
                                                    <Quote className="w-8 h-8 text-primary-200 mb-2 inline-block mr-2" />
                                                    {book.review}
                                                </div>
                                            ) : (
                                                <p className="text-stone-400 italic">No written review yet...</p>
                                            )}
                                        </div>

                                        {/* Tags or Actions */}
                                        <div className="mt-6 pt-6 border-t border-stone-100 flex items-center gap-2">
                                            {book.pageCount && (
                                                <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full">
                                                    {book.pageCount} pages
                                                </span>
                                            )}
                                            {book.ageRating && (
                                                <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full">
                                                    Age: {book.ageRating}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            ) : (
                <FadeIn delay={0.2}>
                    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                        <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-stone-700 mb-2">No reviews yet</h2>
                        <p className="text-stone-500 mb-6">Read some books and add your thoughts to see them here!</p>
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                        >
                            Go to Bookshelf <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </FadeIn>
            )}
        </div>
    )
}

export default BookReviews
