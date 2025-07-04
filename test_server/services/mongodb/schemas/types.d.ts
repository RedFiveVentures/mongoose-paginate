import { Types } from 'mongoose';
interface BaseDocument {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
interface SocialMedia {
    twitter?: string;
    instagram?: string;
    facebook?: string;
}
interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
interface ContactInfo {
    email?: string;
    phone?: string;
    website?: string;
}
interface Price {
    amount?: number;
    currency?: string;
}
interface Rating {
    average?: number;
    count?: number;
}
declare enum BookGenre {
    FICTION = "Fiction",
    NON_FICTION = "Non-Fiction",
    MYSTERY = "Mystery",
    ROMANCE = "Romance",
    SCIENCE_FICTION = "Science Fiction",
    FANTASY = "Fantasy",
    BIOGRAPHY = "Biography",
    HISTORY = "History",
    SELF_HELP = "Self-Help",
    BUSINESS = "Business",
    TECHNOLOGY = "Technology",
    HEALTH = "Health",
    TRAVEL = "Travel",
    CHILDREN = "Children",
    YOUNG_ADULT = "Young Adult",
    POETRY = "Poetry",
    DRAMA = "Drama",
    OTHER = "Other"
}
declare enum BookFormat {
    HARDCOVER = "Hardcover",
    PAPERBACK = "Paperback",
    EBOOK = "E-book",
    AUDIOBOOK = "Audiobook"
}
interface IAuthor extends BaseDocument {
    firstName: string;
    lastName: string;
    email?: string;
    biography?: string;
    birthDate?: Date;
    nationality?: string;
    website?: string;
    socialMedia?: SocialMedia;
    books: Types.ObjectId[];
    isActive?: boolean;
    fullName: string;
}
interface IAuthorPopulated extends Omit<IAuthor, 'books'> {
    books: IBook[];
}
interface IPublisher extends BaseDocument {
    name: string;
    address?: Address;
    contactInfo?: ContactInfo;
    foundedYear?: number;
    description?: string;
    books: Types.ObjectId[];
    isActive?: boolean;
}
interface IPublisherPopulated extends Omit<IPublisher, 'books'> {
    books: IBook[];
}
interface IBook extends BaseDocument {
    title: string;
    subtitle?: string;
    isbn: string;
    isbn13?: string;
    authors: Types.ObjectId[];
    publisher: Types.ObjectId;
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
    fullTitle: string;
}
interface IBookPopulated extends Omit<IBook, 'authors' | 'publisher'> {
    authors: IAuthor[];
    publisher: IPublisher;
}
interface IBookPartiallyPopulated extends Omit<IBook, 'authors' | 'publisher'> {
    authors: IAuthor[] | Types.ObjectId[];
    publisher: IPublisher | Types.ObjectId;
}
interface IAuthorDocument extends IAuthor {
    fullName: string;
}
interface IPublisherDocument extends IPublisher {
}
interface IBookDocument extends IBook {
    fullTitle: string;
}
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
interface UpdateAuthorInput extends Partial<CreateAuthorInput> {
}
interface CreatePublisherInput {
    name: string;
    address?: Address;
    contactInfo?: ContactInfo;
    foundedYear?: number;
    description?: string;
    isActive?: boolean;
}
interface UpdatePublisherInput extends Partial<CreatePublisherInput> {
}
interface CreateBookInput {
    title: string;
    subtitle?: string;
    isbn: string;
    isbn13?: string;
    authors: string[] | Types.ObjectId[];
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
interface UpdateBookInput extends Partial<CreateBookInput> {
}
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
    title?: string | {
        $regex: string;
        $options: string;
    };
    authors?: Types.ObjectId | Types.ObjectId[];
    publisher?: Types.ObjectId;
    genre?: BookGenre | {
        $in: BookGenre[];
    };
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
interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    populate?: string | string[];
}
interface SearchOptions extends PaginationOptions {
    query?: string;
    filters?: AuthorQuery | PublisherQuery | BookQuery;
}
export { BaseDocument, SocialMedia, Address, ContactInfo, Price, Rating, BookGenre, BookFormat, IAuthor, IAuthorPopulated, IPublisher, IPublisherPopulated, IBook, IBookPopulated, IBookPartiallyPopulated, IAuthorDocument, IPublisherDocument, IBookDocument, CreateAuthorInput, UpdateAuthorInput, CreatePublisherInput, UpdatePublisherInput, CreateBookInput, UpdateBookInput, AuthorQuery, PublisherQuery, BookQuery, AuthorResponse, AuthorsResponse, PublisherResponse, PublishersResponse, BookResponse, BooksResponse, PaginationOptions, SearchOptions };
//# sourceMappingURL=types.d.ts.map