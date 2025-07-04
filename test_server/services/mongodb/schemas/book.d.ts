import mongoose from 'mongoose';
export declare const Book: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    authors: mongoose.Types.ObjectId[];
    publisher: mongoose.Types.ObjectId;
    title: string;
    isbn: string;
    publicationDate: NativeDate;
    genre: ("Fiction" | "Non-Fiction" | "Mystery" | "Romance" | "Science Fiction" | "Fantasy" | "Biography" | "History" | "Self-Help" | "Business" | "Technology" | "Health" | "Travel" | "Children" | "Young Adult" | "Poetry" | "Drama" | "Other" | "Horror" | "Political Satire")[];
    language: string;
    format: "Hardcover" | "Paperback" | "E-book" | "Audiobook";
    tags: string[];
    isAvailable: boolean;
    stock: number;
    description?: string | null | undefined;
    subtitle?: string | null | undefined;
    isbn13?: string | null | undefined;
    pages?: number | null | undefined;
    price?: {
        currency: string;
        amount?: number | null | undefined;
    } | null | undefined;
    coverImage?: string | null | undefined;
    rating?: {
        average: number;
        count: number;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=book.d.ts.map