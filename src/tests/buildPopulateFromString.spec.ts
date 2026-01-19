import { buildPopulate } from '../utils/buildPopulateFromString';

describe('buildPopulate', () => {
    describe('basic path parsing', () => {
        test('should return empty array for empty string', () => {
            const result = buildPopulate('');
            expect(result).toEqual([]);
        });

        test('should return empty array for null/undefined', () => {
            const result = buildPopulate(null as any);
            expect(result).toEqual([]);
        });

        test('should parse single path', () => {
            const result = buildPopulate('author');
            expect(result).toEqual([{ path: 'author' }]);
        });

        test('should parse multiple paths', () => {
            const result = buildPopulate('author, books');
            expect(result).toEqual([
                { path: 'author' },
                { path: 'books' }
            ]);
        });

        test('should trim whitespace from paths', () => {
            const result = buildPopulate('  author  ,  books  ');
            expect(result).toEqual([
                { path: 'author' },
                { path: 'books' }
            ]);
        });
    });

    describe('nested path parsing', () => {
        test('should parse nested path with dot notation', () => {
            const result = buildPopulate('author.profile');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [{ path: 'profile' }]
                }
            ]);
        });

        test('should parse deeply nested path', () => {
            const result = buildPopulate('author.profile.avatar');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [
                        {
                            path: 'profile',
                            populate: [{ path: 'avatar' }]
                        }
                    ]
                }
            ]);
        });

        test('should merge nested paths with same root', () => {
            const result = buildPopulate('author.profile, author.books');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [
                        { path: 'profile' },
                        { path: 'books' }
                    ]
                }
            ]);
        });
    });

    describe('select field parsing', () => {
        test('should parse path with select in brackets', () => {
            const result = buildPopulate('author[name,email]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name email'
                }
            ]);
        });

        test('should parse path with single select field', () => {
            const result = buildPopulate('author[name]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name'
                }
            ]);
        });

        test('should parse multiple paths with select', () => {
            const result = buildPopulate('author[name], books[title,isbn]');
            expect(result).toEqual([
                { path: 'author', select: 'name' },
                { path: 'books', select: 'title isbn' }
            ]);
        });
    });

    describe('nested paths with select', () => {
        test('should parse nested path with select on child', () => {
            const result = buildPopulate('author.profile[bio,avatar]');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [
                        {
                            path: 'profile',
                            select: 'bio avatar'
                        }
                    ]
                }
            ]);
        });

        test('should parse nested path with select on parent', () => {
            const result = buildPopulate('author[name].profile');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name',
                    populate: [{ path: 'profile' }]
                }
            ]);
        });

        test('should parse nested path with select on both', () => {
            const result = buildPopulate('author[name].profile[bio]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name',
                    populate: [
                        {
                            path: 'profile',
                            select: 'bio'
                        }
                    ]
                }
            ]);
        });
    });

    describe('complex scenarios', () => {
        test('should handle multiple nested paths with different depths', () => {
            const result = buildPopulate('author.profile, books.publisher.location');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [{ path: 'profile' }]
                },
                {
                    path: 'books',
                    populate: [
                        {
                            path: 'publisher',
                            populate: [{ path: 'location' }]
                        }
                    ]
                }
            ]);
        });

        test('should merge multiple nested paths correctly', () => {
            const result = buildPopulate('author.profile, author.books, author.followers');
            expect(result).toEqual([
                {
                    path: 'author',
                    populate: [
                        { path: 'profile' },
                        { path: 'books' },
                        { path: 'followers' }
                    ]
                }
            ]);
        });

        test('should handle commas inside brackets correctly', () => {
            const result = buildPopulate('author[name,email,bio]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name email bio'
                }
            ]);
        });

        test('should handle complex combination', () => {
            const result = buildPopulate('author[name].profile[bio], books[title]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: 'name',
                    populate: [
                        {
                            path: 'profile',
                            select: 'bio'
                        }
                    ]
                },
                {
                    path: 'books',
                    select: 'title'
                }
            ]);
        });
    });

    describe('edge cases', () => {
        test('should handle path with empty brackets', () => {
            const result = buildPopulate('author[]');
            // Empty brackets are preserved in the path name
            expect(result).toEqual([{ path: 'author[]' }]);
        });

        test('should handle whitespace around brackets', () => {
            const result = buildPopulate('author[ name , email ]');
            expect(result).toEqual([
                {
                    path: 'author',
                    select: ' name   email '
                }
            ]);
        });

        test('should handle single character paths', () => {
            const result = buildPopulate('a, b, c');
            expect(result).toEqual([
                { path: 'a' },
                { path: 'b' },
                { path: 'c' }
            ]);
        });
    });
});
