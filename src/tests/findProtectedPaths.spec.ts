import { findProtectedPaths } from "../utils/findProtectedPaths";
import mongoose, { Schema } from "mongoose";

describe('findProtectedPaths', () => {
    afterAll(async () => {
        // Clean up mongoose connections
        await mongoose.disconnect();
    });

    test('should return empty array for schema with no protected paths', () => {
        const schema = new Schema({
            name: { type: String },
            age: { type: Number }
        });
        const model = mongoose.model('NoProtectedModel', schema);
        const results = findProtectedPaths(model);
        expect(results).toEqual([]);
    });

    test('should find paths with select: false', () => {
        const schema = new Schema({
            name: { type: String },
            password: { type: String, select: false },
            email: { type: String }
        });
        const model = mongoose.model('ProtectedModel', schema);
        const results = findProtectedPaths(model);
        expect(results).toContain('password');
    });

    test('should find multiple protected paths', () => {
        const schema = new Schema({
            name: { type: String },
            password: { type: String, select: false },
            secretKey: { type: String, select: false },
            email: { type: String }
        });
        const model = mongoose.model('MultiProtectedModel', schema);
        const results = findProtectedPaths(model);
        expect(results).toContain('password');
        expect(results).toContain('secretKey');
        expect(results.length).toBe(2);
    });

    test('should find protected paths in nested objects', () => {
        const schema = new Schema({
            name: { type: String },
            profile: {
                bio: { type: String },
                privateData: { type: String, select: false }
            }
        });
        const model = mongoose.model('NestedProtectedModel', schema);
        const results = findProtectedPaths(model);
        expect(results.some(p => p.includes('privateData'))).toBe(true);
    });

    test('should handle schema with mixed regular and protected fields', () => {
        const schema = new Schema({
            username: { type: String, required: true },
            email: { type: String, unique: true },
            password: { type: String, select: false },
            apiKey: { type: String, select: false },
            createdAt: { type: Date, default: Date.now }
        });
        const model = mongoose.model('MixedFieldsModel', schema);
        const results = findProtectedPaths(model);
        expect(results).toContain('password');
        expect(results).toContain('apiKey');
        expect(results).not.toContain('username');
        expect(results).not.toContain('email');
        expect(results).not.toContain('createdAt');
    });

    test('should handle deeply nested schema with protected paths', () => {
        const nestedSchema = new Schema({
            secret: { type: String, select: false }
        }, { _id: false });

        const schema = new Schema({
            name: { type: String },
            nested: nestedSchema
        });
        const model = mongoose.model('DeepNestedModel', schema);
        const results = findProtectedPaths(model);
        expect(results.some(p => p.includes('secret'))).toBe(true);
    });

    test('should return empty array when schema has simple array fields', () => {
        const schema = new Schema({
            tags: [String],
            scores: [Number]
        });
        const model = mongoose.model('ArrayFieldsModel', schema);
        const results = findProtectedPaths(model);
        expect(Array.isArray(results)).toBe(true);
    });
});
