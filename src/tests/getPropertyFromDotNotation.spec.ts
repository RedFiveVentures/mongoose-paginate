
// Import the function (assuming it's exported from a module)
 import { getPropertyFromDotNotation } from '../utils/dotNotation';

describe('getPropertyFromDotNotation', () => {
    const testObject = {
        user: {
            profile: {
                name: 'John Doe',
                age: 30,
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    zipCode: '10001'
                }
            },
            settings: {
                theme: 'dark',
                notifications: {
                    email: true,
                    push: false,
                    sms: null
                }
            },
            tags: ['admin', 'user'],
            active: true,
            score: 0,
            metadata: {
                created: '2023-01-01',
                updated: null
            }
        },
        app: {
            version: '1.0.0',
            features: {
                auth: true
            }
        }
    };

    test('should retrieve simple nested property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.profile.name');
        expect(result).toBe('John Doe');
    });

    test('should retrieve deeply nested property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.profile.address.street');
        expect(result).toBe('123 Main St');
    });

    test('should retrieve top-level property', () => {
        const result = getPropertyFromDotNotation(testObject, 'app');
        expect(result).toEqual({
            version: '1.0.0',
            features: {
                auth: true
            }
        });
    });

    test('should retrieve array property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.tags');
        expect(result).toEqual(['admin', 'user']);
    });

    test('should retrieve boolean property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.active');
        expect(result).toBe(true);

        const result2 = getPropertyFromDotNotation(testObject, 'user.settings.notifications.push');
        expect(result2).toBe(false);
    });

    test('should retrieve number property including zero', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.profile.age');
        expect(result).toBe(30);

        const result2 = getPropertyFromDotNotation(testObject, 'user.score');
        expect(result2).toBe(0);
    });

    test('should retrieve null values', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.settings.notifications.sms');
        expect(result).toBeNull();

        const result2 = getPropertyFromDotNotation(testObject, 'user.metadata.updated');
        expect(result2).toBeNull();
    });

    test('should return undefined for non-existent property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.nonExistent');
        expect(result).toBeUndefined();
    });

    test('should return undefined for deeply nested non-existent property', () => {
        const result = getPropertyFromDotNotation(testObject, 'user.profile.nonExistent.deeply.nested');
        expect(result).toBeUndefined();
    });

    test('should handle empty path', () => {
        const result = getPropertyFromDotNotation(testObject, '');
        expect(result).toBeUndefined();
    });

    test('should handle single property name (no dots)', () => {
        const simpleObject = { name: 'test' };
        const result = getPropertyFromDotNotation(simpleObject, 'name');
        expect(result).toBe('test');
    });

    test('should handle null object', () => {
        const result = getPropertyFromDotNotation(null, 'user.name');
        expect(result).toBeNull();
    });

    test('should handle undefined object', () => {
        const result = getPropertyFromDotNotation(undefined, 'user.name');
        expect(result).toBeUndefined();
    });

    test('should handle empty object', () => {
        const result = getPropertyFromDotNotation({}, 'user.name');
        expect(result).toBeUndefined();
    });

    test('should handle path with empty string segments', () => {
        const objWithEmptyKey = {
            user: {
                '': {
                    name: 'test'
                }
            }
        };
        const result = getPropertyFromDotNotation(objWithEmptyKey, 'user..name');
        expect(result).toBe('test');
    });

    test('should handle numeric string keys', () => {
        const objWithNumericKeys = {
            items: {
                '0': 'first',
                '1': 'second'
            }
        };
        const result = getPropertyFromDotNotation(objWithNumericKeys, 'items.0');
        expect(result).toBe('first');
    });

    test('should handle array access with numeric keys', () => {
        const objWithArray = {
            list: ['item1', 'item2', 'item3']
        };
        const result = getPropertyFromDotNotation(objWithArray, 'list.1');
        expect(result).toBe('item2');
    });

    test('should handle special characters in keys', () => {
        const objWithSpecialKeys = {
            'user-name': 'test',
            'user_id': 123,
            'user@domain': 'email'
        };
        expect(getPropertyFromDotNotation(objWithSpecialKeys, 'user-name')).toBe('test');
        expect(getPropertyFromDotNotation(objWithSpecialKeys, 'user_id')).toBe(123);
        expect(getPropertyFromDotNotation(objWithSpecialKeys, 'user@domain')).toBe('email');
    });

    test('should handle complex nested structures', () => {
        const complexObject = {
            data: {
                results: [
                    { id: 1, name: 'First' },
                    { id: 2, name: 'Second' }
                ],
                pagination: {
                    total: 2,
                    page: 1
                }
            }
        };

        expect(getPropertyFromDotNotation(complexObject, 'data.results.0.name')).toBe('First');
        expect(getPropertyFromDotNotation(complexObject, 'data.pagination.total')).toBe(2);
    });

    test('should handle function properties', () => {
        const objWithFunction = {
            utils: {
                getValue: () => 'function result'
            }
        };
        const result = getPropertyFromDotNotation(objWithFunction, 'utils.getValue');
        expect(typeof result).toBe('function');
        expect(result()).toBe('function result');
    });

    test('should handle Symbol keys', () => {
        const symbolKey = Symbol('test');
        const objWithSymbol = {
            data: {
                [symbolKey]: 'symbol value'
            }
        };
        // This should return undefined since symbols can't be accessed via string paths
        const result = getPropertyFromDotNotation(objWithSymbol, 'data.Symbol(test)');
        expect(result).toBeUndefined();
    });

    test('should handle prototype chain properties', () => {
        function TestClass(this: any) {
            this.instanceProp = 'instance';
        }
        TestClass.prototype.prototypeProp = 'prototype';

        const instance = new TestClass();
        expect(getPropertyFromDotNotation(instance, 'instanceProp')).toBe('instance');
        expect(getPropertyFromDotNotation(instance, 'prototypeProp')).toBe('prototype');
    });

    test('should handle Date objects', () => {
        const objWithDate = {
            event: {
                date: new Date('2023-01-01T10:00:00Z')
            }
        };
        const result = getPropertyFromDotNotation(objWithDate, 'event.date');
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2023);
    });

    test('should handle performance with deeply nested objects', () => {
        // Create a deeply nested object
        let deepObject = { value: 'deep' } as {level?:any, value?: string};
        let path = 'value';

        for (let i = 0; i < 100; i++) {
            deepObject = { level: deepObject };
            path = 'level.' + path;
        }

        const result = getPropertyFromDotNotation(deepObject, path);
        expect(result).toBe('deep');
    });
});