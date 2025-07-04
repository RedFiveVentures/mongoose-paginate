"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const author_1 = require("./author");
const publisher_1 = require("./publisher");
// Book Schema
const bookSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Author',
            required: true
        }],
    // Reference to publisher
    publisher: {
        type: mongoose_1.Schema.Types.ObjectId,
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
bookSchema.virtual('fullTitle').get(function () {
    return this.subtitle ? `${this.title}: ${this.subtitle}` : this.title;
});
// Indexes for searching and performance
bookSchema.index({ title: 1 });
bookSchema.index({ authors: 1 });
bookSchema.index({ publisher: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ publicationDate: -1 });
// Pre-save middleware to update author and publisher references
bookSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || this.isModified('authors')) {
            // Add this book to authors' books array
            yield mongoose_1.default.model('Author').updateMany({ _id: { $in: this.authors } }, { $addToSet: { books: this._id } });
        }
        if (this.isNew || this.isModified('publisher')) {
            // Add this book to publisher's books array
            yield mongoose_1.default.model('Publisher').findByIdAndUpdate(this.publisher, { $addToSet: { books: this._id } });
        }
        next();
    });
});
// Pre-remove middleware to clean up references
bookSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove this book from authors' books array
        yield author_1.Author.updateMany({ _id: { $in: this.authors } }, { $pull: { books: this._id } });
        // Remove this book from publisher's books array
        yield publisher_1.Publisher.findByIdAndUpdate(this.publisher, { $pull: { books: this._id } });
        next();
    });
});
// Static methods for common queries
bookSchema.statics.findByAuthor = function (authorId) {
    return this.find({ authors: authorId }).populate('authors publisher');
};
bookSchema.statics.findByPublisher = function (publisherId) {
    return this.find({ publisher: publisherId }).populate('authors publisher');
};
bookSchema.statics.findByGenre = function (genre) {
    return this.find({ genre: genre }).populate('authors publisher');
};
// Create models
exports.Book = mongoose_1.default.model('Book', bookSchema);
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
