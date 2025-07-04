
import {dotNotationToObject, createObjectFromDotNotation} from '../utils/dotNotation'

describe('dotNotationToObject', () => {
    test('should create simple nested object', () => {
        const result = dotNotationToObject('user.name', 'John Doe');
        expect(result).toEqual({
            user: {
                name: 'John Doe'
            }
        });
    });

    test('should create deeply nested object', () => {
        const result = dotNotationToObject('user.profile.personal.name', 'Jane Smith');
        expect(result).toEqual({
            user: {
                profile: {
                    personal: {
                        name: 'Jane Smith'
                    }
                }
            }
        });
    });

    test('should handle single key (no dots)', () => {
        const result = dotNotationToObject('name', 'Alice');
        expect(result).toEqual({
            name: 'Alice'
        });
    });

    test('should handle null value', () => {
        const result = dotNotationToObject('user.name', null);
        expect(result).toEqual({
            user: {
                name: null
            }
        });
    });

    test('should handle undefined value', () => {
        let a;
        const result = dotNotationToObject('user.name', a);
        expect(result).toEqual({
            user: {
                name: null
            }
        });
    });

    test('should handle different value types', () => {
        expect(dotNotationToObject('user.age', 25)).toEqual({
            user: { age: 25 }
        });

        expect(dotNotationToObject('user.active', true)).toEqual({
            user: { active: true }
        });

        expect(dotNotationToObject('user.tags', ['admin', 'user'])).toEqual({
            user: { tags: ['admin', 'user'] }
        });

        expect(dotNotationToObject('user.meta', { created: '2023-01-01' })).toEqual({
            user: { meta: { created: '2023-01-01' } }
        });
    });

    test('should handle empty string key', () => {
        const result = dotNotationToObject('user..name', 'Test');
        expect(result).toEqual({
            user: {
                '': {
                    name: 'Test'
                }
            }
        });
    });

    test('should use null as default value when no value provided', () => {
        const result = dotNotationToObject('user.name');
        expect(result).toEqual({
            user: {
                name: null
            }
        });
    });
});

describe('createObjectFromDotNotation', () => {
    test('should create object from single dot notation entry', () => {
        const input = {
            'user.name': 'John Doe'
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            user: {
                name: 'John Doe'
            }
        });
    });

    test('should merge multiple dot notation entries', () => {
        const input = {
            'user.profile.name': 'John Doe',
            'user.profile.age': 30,
            'user.settings.theme': 'dark'
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            user: {
                profile: {
                    name: 'John Doe',
                    age: 30
                },
                settings: {
                    theme: 'dark'
                }
            }
        });
    });

    test('should handle complex nested structure', () => {
        const input = {
            'app.name': 'MyApp',
            'app.version': '1.0.0',
            'app.config.database.host': 'localhost',
            'app.config.database.port': 5432,
            'app.config.redis.host': 'redis-server',
            'app.features.auth.enabled': true,
            'app.features.auth.providers': ['google', 'github'],
            'app.features.notifications.email': true,
            'app.features.notifications.push': false
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            app: {
                name: 'MyApp',
                version: '1.0.0',
                config: {
                    database: {
                        host: 'localhost',
                        port: 5432
                    },
                    redis: {
                        host: 'redis-server'
                    }
                },
                features: {
                    auth: {
                        enabled: true,
                        providers: ['google', 'github']
                    },
                    notifications: {
                        email: true,
                        push: false
                    }
                }
            }
        });
    });

    test('should handle conflicting paths by overwriting', () => {
        const input = {
            'user.name': 'John',
            'user.name.first': 'John',
            'user.name.last': 'Doe'
        };
        const result = createObjectFromDotNotation(input);
        // The object should be overwritten when there's a conflict
        expect(result).toEqual({
            user: {
                name: {
                    first: 'John',
                    last: 'Doe'
                }
            }
        });
    });

    test('should handle empty object', () => {
        const result = createObjectFromDotNotation({});
        expect(result).toEqual({});
    });

    test('should handle single key without dots', () => {
        const input = {
            'name': 'John Doe',
            'age': 30
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            name: 'John Doe',
            age: 30
        });
    });

    test('should handle various value types', () => {
        const input = {
            'string': 'text',
            'number': 42,
            'boolean': true,
            'null': null,
            'undefined': undefined,
            'array': [1, 2, 3],
            'object': { nested: 'value' }
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            string: 'text',
            number: 42,
            boolean: true,
            null: null,
            undefined: undefined,
            array: [1, 2, 3],
            object: { nested: 'value' }
        });
    });

    test('should handle empty string keys', () => {
        const input = {
            'user..name': 'Test',
            'user...deep': 'Value'
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            user: {
                '': {
                    name: 'Test',
                    '': {
                        deep: 'Value'
                    }
                }
            }
        });
    });
});

describe('Edge cases and error handling', () => {
    test('dotNotationToObject should handle empty string', () => {
        const result = dotNotationToObject('', 'value');
        expect(result).toEqual({
            '': 'value'
        });
    });

    test('createObjectFromDotNotation should handle keys with empty string', () => {
        const input = {
            '': 'root value'
        };
        const result = createObjectFromDotNotation(input);
        expect(result).toEqual({
            '': 'root value'
        });
    });

    test('should preserve object references', () => {
        const sharedObject = { shared: 'data' };
        const input = {
            'user.meta': sharedObject,
            'app.config': sharedObject
        };
        const result:any = createObjectFromDotNotation(input);
        expect(result.user.meta).toBe(sharedObject);
        expect(result.app.config).toBe(sharedObject);
        expect(result.user.meta).toBe(result.app.config);
    });
});