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
exports.Publisher = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//Publisher Schema
const publisherSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    contactInfo: {
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        phone: String,
        website: String
    },
    foundedYear: {
        type: Number,
        min: 1400,
        max: new Date().getFullYear()
    },
    description: {
        type: String,
        maxlength: 1000
    },
    // Reference to books published by this publisher
    books: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Book'
        }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for searching publishers
publisherSchema.statics.findWithBooks = function () {
    return this.find().populate('books');
};
exports.Publisher = mongoose_1.default.model('Publisher', publisherSchema);
