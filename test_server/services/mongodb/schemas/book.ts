import mongoose, {Schema, Model} from 'mongoose';
import {Author} from "./author";
import {Publisher} from "./publisher";


// Book Schema
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    isbn: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    isbn13: {
        type: String,
        trim: true
    },
    // Reference to author(s) - a book can have multiple authors
    authors: [{
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }],
    // Reference to publisher
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'Publisher',
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    genre: [{
        type: String,
        enum: [
            'Fiction',
            'Non-Fiction',
            'Horror',
            'Mystery',
            'Romance',
            'Science Fiction',
            'Fantasy',
            'Biography',
            'History',
            'Self-Help',
            'Business',
            'Technology',
            'Health',
            'Travel',
            'Children',
            'Young Adult',
            'Poetry',
            'Drama',
            'Political Satire',
            'Other'
        ]
    }],
    language: {
        type: String,
        default: 'English',
        trim: true
    },
    pages: {
        type: Number,
        min: 1
    },
    format: {
        type: String,
        enum: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
        default: 'Paperback'
    },
    price: {
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    description: {
        type: String,
        maxlength: 2000
    },
    coverImage: {
        type: String, // URL to cover image
        trim: true
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full title (title + subtitle)
bookSchema.virtual('fullTitle').get(function() {
    return this.subtitle ? `${this.title}: ${this.subtitle}` : this.title;
});

// Indexes for searching and performance
bookSchema.index({ title: 1 });
bookSchema.index({ authors: 1 });
bookSchema.index({ publisher: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ publicationDate: -1 });

// Pre-save middleware to update author and publisher references
bookSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('authors')) {
        // Add this book to authors' books array
        await mongoose.model('Author').updateMany(
            { _id: { $in: this.authors } },
            { $addToSet: { books: this._id } }
        );
    }

    if (this.isNew || this.isModified('publisher')) {
        // Add this book to publisher's books array
        await mongoose.model('Publisher').findByIdAndUpdate(
            this.publisher,
            { $addToSet: { books: this._id } }
        );
    }

    next();
});

// Pre-remove middleware to clean up references
bookSchema.pre('deleteOne',{document: true, query: false},  async function(next) {
    // Remove this book from authors' books array
    await Author.updateMany(
        { _id: { $in: this.authors } },
        { $pull: { books: this._id } }
    );

    // Remove this book from publisher's books array
    await Publisher.findByIdAndUpdate(
        this.publisher,
        { $pull: { books: this._id } }
    );

    next();
});

// Static methods for common queries
bookSchema.statics.findByAuthor = function(authorId) {
    return this.find({ authors: authorId }).populate('authors publisher');
};

bookSchema.statics.findByPublisher = function(publisherId) {
    return this.find({ publisher: publisherId }).populate('authors publisher');
};

bookSchema.statics.findByGenre = function(genre) {
    return this.find({ genre: genre }).populate('authors publisher');
};





// Create models

export const Book = mongoose.model('Book', bookSchema);



// Example usage:
/*
// Create an author
const author = new Author({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  biography: 'A prolific writer of science fiction novels.',
  birthDate: new Date('1980-05-15'),
  nationality: 'American'
});

// Create a publisher
const publisher = new Publisher({
  name: 'Penguin Random House',
  address: {
    city: 'New York',
    state: 'NY',
    country: 'USA'
  },
  contactInfo: {
    email: 'contact@penguinrandomhouse.com',
    website: 'https://www.penguinrandomhouse.com'
  },
  foundedYear: 1927
});

// Create a book with references
const book = new Book({
  title: 'The Future of AI',
  isbn: '978-0-123456-78-9',
  authors: [author._id],
  publisher: publisher._id,
  publicationDate: new Date('2024-01-15'),
  genre: ['Technology', 'Science Fiction'],
  pages: 350,
  format: 'Hardcover',
  price: {
    amount: 29.99,
    currency: 'USD'
  },
  description: 'An exploration of artificial intelligence and its impact on society.'
});

// Save all documents
await author.save();
await publisher.save();
await book.save();

// Query with population
const booksWithAuthors = await Book.find().populate('authors publisher');
const authorWithBooks = await Author.findById(author._id).populate('books');
*/