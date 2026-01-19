import { isJsonString } from '../utils/isJsonString';

describe('isJsonString', () => {
    describe('valid JSON strings', () => {
        test('should return true for empty object', () => {
            expect(isJsonString('{}')).toBe(true);
        });

        test('should return true for empty array', () => {
            expect(isJsonString('[]')).toBe(true);
        });

        test('should return true for simple object', () => {
            expect(isJsonString('{"name":"John"}')).toBe(true);
        });

        test('should return true for simple array', () => {
            expect(isJsonString('[1,2,3]')).toBe(true);
        });

        test('should return true for nested object', () => {
            expect(isJsonString('{"user":{"name":"John","age":30}}')).toBe(true);
        });

        test('should return true for array of objects', () => {
            expect(isJsonString('[{"id":1},{"id":2}]')).toBe(true);
        });

        test('should return true for string value', () => {
            expect(isJsonString('"hello"')).toBe(true);
        });

        test('should return true for number value', () => {
            expect(isJsonString('123')).toBe(true);
        });

        test('should return true for boolean true', () => {
            expect(isJsonString('true')).toBe(true);
        });

        test('should return true for boolean false', () => {
            expect(isJsonString('false')).toBe(true);
        });

        test('should return true for null', () => {
            expect(isJsonString('null')).toBe(true);
        });

        test('should return true for complex nested structure', () => {
            const complex = JSON.stringify({
                users: [
                    { id: 1, profile: { name: 'John', tags: ['admin', 'user'] } },
                    { id: 2, profile: { name: 'Jane', tags: ['user'] } }
                ],
                meta: { total: 2, page: 1 }
            });
            expect(isJsonString(complex)).toBe(true);
        });

        test('should return true for JSON with special characters', () => {
            expect(isJsonString('{"message":"Hello\\nWorld"}')).toBe(true);
        });

        test('should return true for JSON with unicode', () => {
            expect(isJsonString('{"emoji":"\\u2764"}')).toBe(true);
        });
    });

    describe('invalid JSON strings', () => {
        test('should return false for plain text', () => {
            expect(isJsonString('hello world')).toBe(false);
        });

        test('should return false for single quotes', () => {
            expect(isJsonString("{'name':'John'}")).toBe(false);
        });

        test('should return false for missing quotes on keys', () => {
            expect(isJsonString('{name:"John"}')).toBe(false);
        });

        test('should return false for trailing comma', () => {
            expect(isJsonString('{"name":"John",}')).toBe(false);
        });

        test('should return false for unclosed object', () => {
            expect(isJsonString('{"name":"John"')).toBe(false);
        });

        test('should return false for unclosed array', () => {
            expect(isJsonString('[1,2,3')).toBe(false);
        });

        test('should return false for undefined', () => {
            expect(isJsonString('undefined')).toBe(false);
        });

        test('should return false for NaN', () => {
            expect(isJsonString('NaN')).toBe(false);
        });

        test('should return false for Infinity', () => {
            expect(isJsonString('Infinity')).toBe(false);
        });

        test('should return false for JavaScript object literal', () => {
            expect(isJsonString('{name: "John"}')).toBe(false);
        });

        test('should return false for empty string', () => {
            expect(isJsonString('')).toBe(false);
        });

        test('should return false for whitespace only', () => {
            expect(isJsonString('   ')).toBe(false);
        });

        test('should return false for function', () => {
            expect(isJsonString('function() {}')).toBe(false);
        });

        test('should return false for date string', () => {
            expect(isJsonString('2023-01-01')).toBe(false);
        });
    });

    describe('edge cases', () => {
        test('should return true for deeply nested structure', () => {
            const deep = '{"a":{"b":{"c":{"d":{"e":"value"}}}}}';
            expect(isJsonString(deep)).toBe(true);
        });

        test('should return true for large array', () => {
            const arr = JSON.stringify(Array.from({ length: 1000 }, (_, i) => i));
            expect(isJsonString(arr)).toBe(true);
        });

        test('should return true for JSON with whitespace', () => {
            expect(isJsonString('{ "name" : "John" }')).toBe(true);
        });

        test('should return true for JSON with newlines', () => {
            expect(isJsonString('{\n  "name": "John"\n}')).toBe(true);
        });
    });
});
