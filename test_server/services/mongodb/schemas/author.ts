import mongoose, {Model, Schema} from 'mongoose';
import {IAuthor} from "./types";

const a = new Schema({
    test: {type: String, select: false},
})
// Author Schema
const authorSchema = new Schema<any>({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },

    biography: {
        type: String,
        select: false,
        maxlength: 2000,
    },
    birthDate: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    socialMedia: {
        twitter: String,
        instagram: String,
        facebook: String
    },
    // Reference to books written by this author
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
authorSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

authorSchema.virtual('moreBooks', {ref: 'Book', foreignField: '_id',localField: 'books'})

// Index for searching authors
authorSchema.index({ firstName: 1, lastName: 1 });


authorSchema.statics.findWithBooks = function() {
    return this.find().populate('books');
};

export const Author = mongoose.model('Author', authorSchema);