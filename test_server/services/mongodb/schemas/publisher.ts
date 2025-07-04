import mongoose, {Schema, Model} from 'mongoose';

//Publisher Schema
const publisherSchema = new Schema({
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
        type: Schema.Types.ObjectId,
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


publisherSchema.statics.findWithBooks = function() {
    return this.find().populate('books');
};
export const Publisher = mongoose.model('Publisher', publisherSchema);
