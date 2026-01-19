import { buildFullPath, traverseSchemaObject } from '../utils/schemaTraversal';

describe('schemaTraversal', () => {
    describe('buildFullPath', () => {
        test('should return child path when parent is empty', () => {
            expect(buildFullPath('', 'child')).toBe('child');
        });

        test('should return parent path when child is empty', () => {
            expect(buildFullPath('parent', '')).toBe('parent');
        });

        test('should combine parent and child with dot notation', () => {
            expect(buildFullPath('parent', 'child')).toBe('parent.child');
        });

        test('should handle deeply nested paths', () => {
            expect(buildFullPath('parent.nested', 'child')).toBe('parent.nested.child');
        });

        test('should handle empty strings for both', () => {
            expect(buildFullPath('', '')).toBe('');
        });
    });

    describe('traverseSchemaObject', () => {
        test('should call callback for current object', () => {
            const obj = { path: 'test', options: { type: 'String' } };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback);

            expect(callback).toHaveBeenCalledWith(obj, '');
        });

        test('should handle null object', () => {
            const callback = jest.fn();

            traverseSchemaObject(null, callback);

            expect(callback).not.toHaveBeenCalled();
        });

        test('should handle undefined object', () => {
            const callback = jest.fn();

            traverseSchemaObject(undefined, callback);

            expect(callback).not.toHaveBeenCalled();
        });

        test('should handle non-object values', () => {
            const callback = jest.fn();

            traverseSchemaObject('string', callback);
            traverseSchemaObject(123, callback);
            traverseSchemaObject(true, callback);

            expect(callback).not.toHaveBeenCalled();
        });

        test('should traverse nested paths in options.type.paths', () => {
            const obj = {
                path: 'parent',
                options: {
                    type: {
                        paths: {
                            child1: { path: 'child1', selected: false },
                            child2: { path: 'child2', selected: true }
                        }
                    }
                }
            };
            const visitedPaths: string[] = [];
            const callback = jest.fn((obj, path) => {
                if (obj.path) visitedPaths.push(obj.path);
            });

            traverseSchemaObject(obj, callback);

            expect(callback).toHaveBeenCalledTimes(3); // parent + 2 children
            expect(visitedPaths).toContain('parent');
            expect(visitedPaths).toContain('child1');
            expect(visitedPaths).toContain('child2');
        });

        test('should traverse nested type object without paths', () => {
            const obj = {
                path: 'parent',
                options: {
                    type: {
                        ref: 'SomeModel',
                        nested: { path: 'nested' }
                    }
                }
            };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback);

            // Should call for parent and nested type
            expect(callback).toHaveBeenCalled();
        });

        test('should use provided currentPath', () => {
            const obj = { path: 'test' };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback, 'existingPath');

            expect(callback).toHaveBeenCalledWith(obj, 'existingPath');
        });

        test('should use obj.path as parent path for nested traversal', () => {
            const obj = {
                path: 'parent',
                options: {
                    type: {
                        paths: {
                            child: { path: 'child', selected: false }
                        }
                    }
                }
            };
            const paths: string[] = [];
            const callback = jest.fn((obj, path) => {
                paths.push(path);
            });

            traverseSchemaObject(obj, callback);

            // First call with empty path, second call with 'parent' as path
            expect(paths).toContain('');
            expect(paths).toContain('parent');
        });

        test('should handle object with no options', () => {
            const obj = { path: 'simple' };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback);

            expect(callback).toHaveBeenCalledWith(obj, '');
            expect(callback).toHaveBeenCalledTimes(1);
        });

        test('should handle object with options but no type', () => {
            const obj = { path: 'test', options: { required: true } };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback);

            expect(callback).toHaveBeenCalledWith(obj, '');
            expect(callback).toHaveBeenCalledTimes(1);
        });

        test('should handle empty paths object', () => {
            const obj = {
                path: 'parent',
                options: {
                    type: {
                        paths: {}
                    }
                }
            };
            const callback = jest.fn();

            traverseSchemaObject(obj, callback);

            // Should only call for parent since paths is empty
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});
