import mongoose from 'mongoose';
export declare const Publisher: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    books: mongoose.Types.ObjectId[];
    isActive: boolean;
    description?: string | null | undefined;
    address?: {
        street?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        country?: string | null | undefined;
    } | null | undefined;
    contactInfo?: {
        email?: string | null | undefined;
        website?: string | null | undefined;
        phone?: string | null | undefined;
    } | null | undefined;
    foundedYear?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=publisher.d.ts.map