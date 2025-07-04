"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFormat = exports.BookGenre = void 0;
// Enums for better type safety
var BookGenre;
(function (BookGenre) {
    BookGenre["FICTION"] = "Fiction";
    BookGenre["NON_FICTION"] = "Non-Fiction";
    BookGenre["MYSTERY"] = "Mystery";
    BookGenre["ROMANCE"] = "Romance";
    BookGenre["SCIENCE_FICTION"] = "Science Fiction";
    BookGenre["FANTASY"] = "Fantasy";
    BookGenre["BIOGRAPHY"] = "Biography";
    BookGenre["HISTORY"] = "History";
    BookGenre["SELF_HELP"] = "Self-Help";
    BookGenre["BUSINESS"] = "Business";
    BookGenre["TECHNOLOGY"] = "Technology";
    BookGenre["HEALTH"] = "Health";
    BookGenre["TRAVEL"] = "Travel";
    BookGenre["CHILDREN"] = "Children";
    BookGenre["YOUNG_ADULT"] = "Young Adult";
    BookGenre["POETRY"] = "Poetry";
    BookGenre["DRAMA"] = "Drama";
    BookGenre["OTHER"] = "Other";
})(BookGenre || (exports.BookGenre = BookGenre = {}));
var BookFormat;
(function (BookFormat) {
    BookFormat["HARDCOVER"] = "Hardcover";
    BookFormat["PAPERBACK"] = "Paperback";
    BookFormat["EBOOK"] = "E-book";
    BookFormat["AUDIOBOOK"] = "Audiobook";
})(BookFormat || (exports.BookFormat = BookFormat = {}));
// Example usage:
/*
// Creating a new book
const newBook: CreateBookInput = {
  title: "The Art of Programming",
  isbn: "978-0-123456-78-9",
  authors: ["60d5ecb54f1a2c001f647a1b"], // Author IDs
  publisher: "60d5ecb54f1a2c001f647a1c", // Publisher ID
  publicationDate: new Date("2024-01-15"),
  genre: [BookGenre.TECHNOLOGY, BookGenre.NON_FICTION],
  format: BookFormat.HARDCOVER,
  price: {
    amount: 49.99,
    currency: "USD"
  }
};

// Querying books
const bookQuery: BookQuery = {
  genre: { $in: [BookGenre.TECHNOLOGY, BookGenre.SCIENCE_FICTION] },
  'price.amount': { $lte: 50 },
  isAvailable: true
};

// API response with populated data
const response: BookResponse = {
  success: true,
  data: {
    _id: new Types.ObjectId(),
    title: "The Art of Programming",
    authors: [
      {
        _id: new Types.ObjectId(),
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe"
        // ... other author fields
      }
    ],
    publisher: {
      _id: new Types.ObjectId(),
      name: "Tech Publications",
      // ... other publisher fields
    }
    // ... other book fields
  }
};
*/ 
