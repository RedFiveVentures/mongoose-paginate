import { getPathsWithRef } from "../utils/getPathsWithRef";

const sampleSchemaData = [
    { "enumValues": [], "regExp": null, "path": "firstName", "instance": "String", "validators": [{ "message": "Path `{PATH}` is required.", "type": "required" }], "getters": [], "setters": [null], "_presplitPath": ["firstName"], "options": { "required": true, "trim": true }, "_index": null, "isRequired": true, "originalRequiredValue": true },
    { "enumValues": [], "regExp": null, "path": "lastName", "instance": "String", "validators": [{ "message": "Path `{PATH}` is required.", "type": "required" }], "getters": [], "setters": [null], "_presplitPath": ["lastName"], "options": { "required": true, "trim": true }, "_index": null, "isRequired": true, "originalRequiredValue": true },
    { "enumValues": [], "regExp": null, "path": "email", "instance": "String", "validators": [], "getters": [], "setters": [null, null], "_presplitPath": ["email"], "options": { "unique": true, "lowercase": true, "trim": true }, "_index": { "unique": true, "background": true } },
    { "schemaOptions": { "strict": true }, "caster": { "path": "books", "instance": "ObjectId", "validators": [], "getters": [], "setters": [], "_presplitPath": ["books"], "options": { "ref": "Book" }, "_index": null, "_arrayPath": "books.$", "_arrayParentPath": "books" }, "$embeddedSchemaType": { "path": "books", "instance": "ObjectId", "validators": [], "getters": [], "setters": [], "_presplitPath": ["books"], "options": { "ref": "Book" }, "_index": null, "_arrayPath": "books.$", "_arrayParentPath": "books" }, "$isMongooseArray": true, "path": "books", "instance": "Array", "validators": [], "getters": [], "setters": [], "_presplitPath": ["books"], "options": { "type": [{ "ref": "Book" }] }, "_index": null },
    { "path": "author", "instance": "ObjectId", "validators": [], "getters": [], "setters": [], "_presplitPath": ["author"], "options": { "ref": "Author" }, "_index": null },
    { "path": "isActive", "instance": "Boolean", "validators": [], "getters": [], "setters": [], "_presplitPath": ["isActive"], "options": { "default": true }, "_index": null, "defaultValue": true },
    { "path": "_id", "instance": "ObjectId", "validators": [], "getters": [], "setters": [null], "_presplitPath": ["_id"], "options": { "auto": true, "type": "ObjectId" }, "_index": null }
];

describe('getPathsWithRef', () => {
    test('should return correct paths with ref from array data', () => {
        const results = getPathsWithRef(sampleSchemaData);

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);

        const paths = results.map(r => r.path);
        expect(paths).toContain('books');
        expect(paths).toContain('author');
    });

    test('should return path and options for each ref', () => {
        const results = getPathsWithRef(sampleSchemaData);

        results.forEach(result => {
            expect(result).toHaveProperty('path');
            expect(result).toHaveProperty('options');
        });
    });

    test('should correctly identify ref in options', () => {
        const results = getPathsWithRef(sampleSchemaData);

        const authorRef = results.find(r => r.path === 'author');
        expect(authorRef).toBeDefined();
        expect(authorRef?.options.ref).toBe('Author');
    });

    test('should correctly identify ref in array type', () => {
        const results = getPathsWithRef(sampleSchemaData);

        const booksRef = results.find(r => r.path === 'books');
        expect(booksRef).toBeDefined();
        // For array types, the ref is in options.type[0].ref or caster.options.ref
        expect(booksRef?.options.type?.[0]?.ref || booksRef?.options.ref).toBe('Book');
    });

    test('should not include paths without ref', () => {
        const results = getPathsWithRef(sampleSchemaData);

        const paths = results.map(r => r.path);
        expect(paths).not.toContain('firstName');
        expect(paths).not.toContain('lastName');
        expect(paths).not.toContain('email');
        expect(paths).not.toContain('isActive');
        expect(paths).not.toContain('_id');
    });

    test('should handle empty array', () => {
        const results = getPathsWithRef([]);

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBe(0);
    });

    test('should handle array with no refs', () => {
        const dataWithoutRefs = [
            { "path": "name", "instance": "String", "options": { "required": true } },
            { "path": "age", "instance": "Number", "options": {} }
        ];

        const results = getPathsWithRef(dataWithoutRefs);
        expect(results.length).toBe(0);
    });

    test('should handle string input', () => {
        const stringData = JSON.stringify({ "path": "user", "instance": "ObjectId", "options": { "ref": "User" } });
        const results = getPathsWithRef(stringData);

        expect(Array.isArray(results)).toBe(true);
    });

    test('should not have duplicate paths', () => {
        const results = getPathsWithRef(sampleSchemaData);

        const paths = results.map(r => r.path);
        const uniquePaths = [...new Set(paths)];
        expect(paths.length).toBe(uniquePaths.length);
    });

    test('should handle nested refs in options.type array', () => {
        const nestedRefData = [
            {
                "path": "categories",
                "instance": "Array",
                "options": {
                    "type": [{ "ref": "Category" }]
                }
            }
        ];

        const results = getPathsWithRef(nestedRefData);
        expect(results.some(r => r.path === 'categories')).toBe(true);
    });

    test('should handle ref in options.type object', () => {
        const typeObjectRefData = [
            {
                "path": "parent",
                "instance": "ObjectId",
                "options": {
                    "type": { "ref": "Parent" }
                }
            }
        ];

        const results = getPathsWithRef(typeObjectRefData);
        expect(results.some(r => r.path === 'parent')).toBe(true);
    });
});
