// src/utils/schemaTraversal.ts

/**
 * Build a dot-notation path from parent and child segments
 */
export function buildFullPath(parentPath: string, childPath: string): string {
    if (!parentPath) return childPath;
    if (!childPath) return parentPath;
    return `${parentPath}.${childPath}`;
}

/**
 * Recursively traverse a Mongoose schema object, calling callback for each node
 */
export function traverseSchemaObject(
    obj: any,
    callback: (obj: any, currentPath: string) => void,
    currentPath: string = ''
): void {
    if (!obj || typeof obj !== 'object') return;

    // Invoke callback for current object
    callback(obj, currentPath);

    // Handle nested paths in complex schema objects (obj.options.type.paths)
    if (obj.options?.type?.paths) {
        const parentPath = obj.path || currentPath;
        for (const nestedObj of Object.values(obj.options.type.paths)) {
            traverseSchemaObject(nestedObj as any, callback, parentPath);
        }
    }

    // Handle nested type object (obj.options.type when it's an object but not paths)
    if (obj.options?.type && typeof obj.options.type === 'object' && !obj.options.type.paths) {
        const parentPath = obj.path || currentPath;
        traverseSchemaObject(obj.options.type, callback, parentPath);
    }
}
