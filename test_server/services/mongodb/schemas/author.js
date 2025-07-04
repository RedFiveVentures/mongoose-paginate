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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const a = new mongoose_1.Schema({
    test: { type: String, select: false },
});
// Author Schema
const authorSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Book'
        }],
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
authorSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
authorSchema.virtual('moreBooks', { ref: 'Book', foreignField: '_id', localField: 'books' });
// Index for searching authors
authorSchema.index({ firstName: 1, lastName: 1 });
authorSchema.statics.findWithBooks = function () {
    return this.find().populate('books');
};
exports.Author = mongoose_1.default.model('Author', authorSchema);
