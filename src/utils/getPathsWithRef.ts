import { buildFullPath, traverseSchemaObject } from './schemaTraversal';

// Private module-level function
function hasRefInOptions(options: any): boolean {
    if (!options || typeof options !== 'object') return false;

    // Direct ref property
    if (options.ref) return true;

    // Check in nested type array
    if (Array.isArray(options.type)) {
        return options.type.some(item => item && typeof item === 'object' && item.ref);
    }

    // Check in nested type object
    if (options.type && typeof options.type === 'object' && options.type.ref) {
        return true;
    }

    return false;
}

export const getPathsWithRef = (data: any[] | string): { path: string; options: any }[] => {
    const results: { path: string; options: any }[] = [];
    const processedPaths = new Set<string>();

    // Normalize input to array of objects
    let objects: any[];
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            objects = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            // If it's not valid JSON, return empty results
            return results;
        }
    } else if (Array.isArray(data)) {
        objects = data;
    } else {
        return results;
    }

    for (const obj of objects) {
        traverseSchemaObject(obj, (schemaObj, currentPath) => {
            const fullPath = buildFullPath(currentPath, schemaObj.path);

            // Check direct options.ref
            if (schemaObj.path && schemaObj.options && hasRefInOptions(schemaObj.options)) {
                if (!processedPaths.has(fullPath)) {
                    processedPaths.add(fullPath);
                    results.push({ path: fullPath, options: schemaObj.options });
                }
            }

            // Check caster.options.ref (for arrays)
            if (schemaObj.caster?.options && hasRefInOptions(schemaObj.caster.options)) {
                const casterPath = buildFullPath(currentPath, schemaObj.path || schemaObj.caster.path);
                if (!processedPaths.has(casterPath)) {
                    processedPaths.add(casterPath);
                    results.push({ path: casterPath, options: schemaObj.caster.options });
                }
            }

            // Check $embeddedSchemaType.options.ref (for arrays)
            if (schemaObj.$embeddedSchemaType?.options && hasRefInOptions(schemaObj.$embeddedSchemaType.options)) {
                const embeddedPath = buildFullPath(currentPath, schemaObj.path || schemaObj.$embeddedSchemaType.path);
                if (!processedPaths.has(embeddedPath)) {
                    processedPaths.add(embeddedPath);
                    results.push({ path: embeddedPath, options: schemaObj.$embeddedSchemaType.options });
                }
            }
        });
    }

    return results;
};
