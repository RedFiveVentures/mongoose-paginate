import { Document, Types } from 'mongoose';

// Base interface for MongoDB documents
interface BaseDocument {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Social media interface for authors
interface SocialMedia {
    twitter?: string;
    instagram?: string;
    facebook?: string;
}

// Address interface for publishers
interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

// Contact information interface for publishers
interface ContactInfo {
    email?: string;
    phone?: string;
    website?: string;
}

// Price interface for books
interface Price {
    amount?: number;
    currency?: string;
}

// Rating interface for books
interface Rating {
    average?: number;
    count?: number;
}

// Enums for better type safety
enum BookGenre {
    FICTION = 'Fiction',
    NON_FICTION = 'Non-Fiction',
    MYSTERY = 'Mystery',
    ROMANCE = 'Romance',
    SCIENCE_FICTION = 'Science Fiction',
    FANTASY = 'Fantasy',
    BIOGRAPHY = 'Biography',
    HISTORY = 'History',
    SELF_HELP = 'Self-Help',
    BUSINESS = 'Business',
    TECHNOLOGY = 'Technology',
    HEALTH = 'Health',
    TRAVEL = 'Travel',
    CHILDREN = 'Children',
    YOUNG_ADULT = 'Young Adult',
    POETRY = 'Poetry',
    DRAMA = 'Drama',
    OTHER = 'Other'
}

enum BookFormat {
    HARDCOVER = 'Hardcover',
    PAPERBACK = 'Paperback',
    EBOOK = 'E-book',
    AUDIOBOOK = 'Audiobook'
}

// Author interface (without populated references)
interface IAuthor extends BaseDocument {
    firstName: string;
    lastName: string;
    email?: string;
    biography?: string;
    birthDate?: Date;
    nationality?: string;
    website?: string;
    socialMedia?: SocialMedia;
    books: Types.ObjectId[]; // Array of Book IDs
    isActive?: boolean;

    // Virtual properties
    fullName: string;
}

// Author interface with populated books
interface IAuthorPopulated extends Omit<IAuthor, 'books'> {
    books: IBook[];
}

// Publisher interface (without populated references)
interface IPublisher extends BaseDocument {
    name: string;
    address?: Address;
    contactInfo?: ContactInfo;
    foundedYear?: number;
    description?: string;
    books: Types.ObjectId[]; // Array of Book IDs
    isActive?: boolean;
}

// Publisher interface with populated books
interface IPublisherPopulated extends Omit<IPublisher, 'books'> {
    books: IBook[];
}

// Book interface (without populated references)
interface IBook extends BaseDocument {
    title: string;
    subtitle?: string;
    isbn: string;
    isbn13?: string;
    authors: Types.ObjectId[]; // Array of Author IDs
    publisher: Types.ObjectId; // Publisher ID
    publicationDate: Date;
    genre?: BookGenre[];
    language?: string;
    pages?: number;
    format?: BookFormat;
    price?: Price;
    description?: string;
    coverImage?: string;
    rating?: Rating;
    tags?: string[];
    isAvailable?: boolean;
    stock?: number;

    // Virtual properties
    fullTitle: string;
}

// Book interface with populated authors and publisher
interface IBookPopulated extends Omit<IBook, 'authors' | 'publisher'> {
    authors: IAuthor[];
    publisher: IPublisher;
}

// Book interface with partially populated references (common scenario)
interface IBookPartiallyPopulated extends Omit<IBook, 'authors' | 'publisher'> {
    authors: IAuthor[] | Types.ObjectId[];
    publisher: IPublisher | Types.ObjectId;
}

// Document interfaces for Mongoose (extends Document)
interface IAuthorDocument extends IAuthor {
    fullName: string;
}

interface IPublisherDocument extends IPublisher {}

interface IBookDocument extends IBook {
    fullTitle: string;
}

// Input interfaces for creating/updating documents (without MongoDB-specific fields)
interface CreateAuthorInput {
    firstName: string;
    lastName: string;
    email?: string;
    biography?: string;
    birthDate?: Date;
    nationality?: string;
    website?: string;
    socialMedia?: SocialMedia;
    isActive?: boolean;
}

interface UpdateAuthorInput extends Partial<CreateAuthorInput> {}

interface CreatePublisherInput {
    name: string;
    address?: Address;
    contactInfo?: ContactInfo;
    foundedYear?: number;
    description?: string;
    isActive?: boolean;
}

interface UpdatePublisherInput extends Partial<CreatePublisherInput> {}

interface CreateBookInput {
    title: string;
    subtitle?: string;
    isbn: string;
    isbn13?: string;
    authors: string[] | Types.ObjectId[]; // Can accept string IDs or ObjectIds
    publisher: string | Types.ObjectId;
    publicationDate: Date;
    genre?: BookGenre[];
    language?: string;
    pages?: number;
    format?: BookFormat;
    price?: Price;
    description?: string;
    coverImage?: string;
    tags?: string[];
    isAvailable?: boolean;
    stock?: number;
}

interface UpdateBookInput extends Partial<CreateBookInput> {}

// Query interfaces for filtering and searching
interface AuthorQuery {
    firstName?: string;
    lastName?: string;
    email?: string;
    nationality?: string;
    isActive?: boolean;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

interface PublisherQuery {
    name?: string;
    'address.country'?: string;
    'address.city'?: string;
    foundedYear?: {
        $gte?: number;
        $lte?: number;
    };
    isActive?: boolean;
}

interface BookQuery {
    title?: string | { $regex: string; $options: string };
    authors?: Types.ObjectId | Types.ObjectId[];
    publisher?: Types.ObjectId;
    genre?: BookGenre | { $in: BookGenre[] };
    language?: string;
    format?: BookFormat;
    isAvailable?: boolean;
    publicationDate?: {
        $gte?: Date;
        $lte?: Date;
    };
    'price.amount'?: {
        $gte?: number;
        $lte?: number;
    };
    'rating.average'?: {
        $gte?: number;
        $lte?: number;
    };
}

// API Response interfaces
interface AuthorResponse {
    success: boolean;
    data?: IAuthor | IAuthorPopulated;
    message?: string;
}

interface AuthorsResponse {
    success: boolean;
    data?: (IAuthor | IAuthorPopulated)[];
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
}

interface PublisherResponse {
    success: boolean;
    data?: IPublisher | IPublisherPopulated;
    message?: string;
}

interface PublishersResponse {
    success: boolean;
    data?: (IPublisher | IPublisherPopulated)[];
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
}

interface BookResponse {
    success: boolean;
    data?: IBook | IBookPopulated;
    message?: string;
}

interface BooksResponse {
    success: boolean;
    data?: (IBook | IBookPopulated)[];
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
}

// Pagination interface
interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    populate?: string | string[];
}

// Search interface
interface SearchOptions extends PaginationOptions {
    query?: string;
    filters?: AuthorQuery | PublisherQuery | BookQuery;
}

// Export all interfaces and enums
export {
    // Base interfaces
    BaseDocument,
    SocialMedia,
    Address,
    ContactInfo,
    Price,
    Rating,

    // Enums
    BookGenre,
    BookFormat,

    // Entity interfaces
    IAuthor,
    IAuthorPopulated,
    IPublisher,
    IPublisherPopulated,
    IBook,
    IBookPopulated,
    IBookPartiallyPopulated,

    // Document interfaces
    IAuthorDocument,
    IPublisherDocument,
    IBookDocument,

    // Input interfaces
    CreateAuthorInput,
    UpdateAuthorInput,
    CreatePublisherInput,
    UpdatePublisherInput,
    CreateBookInput,
    UpdateBookInput,

    // Query interfaces
    AuthorQuery,
    PublisherQuery,
    BookQuery,

    // Response interfaces
    AuthorResponse,
    AuthorsResponse,
    PublisherResponse,
    PublishersResponse,
    BookResponse,
    BooksResponse,

    // Utility interfaces
    PaginationOptions,
    SearchOptions
};

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