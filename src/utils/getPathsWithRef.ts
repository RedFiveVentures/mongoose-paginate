export const getPathsWithRef=(data)=> {
    const results:{path: string, options: any}[] = [];
    const processedPaths = new Set(); // To avoid duplicates

    // Helper function to build full dot notation path
    function buildFullPath(parentPath, childPath) {
        if (!parentPath) return childPath;
        if (!childPath) return parentPath;
        return `${parentPath}.${childPath}`;
    }

    // Function to check if options object contains ref
    function hasRefInOptions(options) {
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

    // Recursive function to traverse nested objects and find ref options
    function traverseObject(obj, currentPath = '') {
        // Check if current object has options with ref
        if (obj.path && obj.options && hasRefInOptions(obj.options)) {
            const fullPath = buildFullPath(currentPath, obj.path);
            if (!processedPaths.has(fullPath)) {
                processedPaths.add(fullPath);
                results.push({
                    path: fullPath,
                    options: obj.options
                });
            }
        }

        // Check caster for array types (like books array)
        if (obj.caster && obj.caster.options && hasRefInOptions(obj.caster.options)) {
            const fullPath = buildFullPath(currentPath, obj.path || obj.caster.path);
            if (!processedPaths.has(fullPath)) {
                processedPaths.add(fullPath);
                results.push({
                    path: fullPath,
                    options: obj.caster.options
                });
            }
        }

        // Check $embeddedSchemaType for array types
        if (obj.$embeddedSchemaType && obj.$embeddedSchemaType.options && hasRefInOptions(obj.$embeddedSchemaType.options)) {
            const fullPath = buildFullPath(currentPath, obj.path || obj.$embeddedSchemaType.path);
            if (!processedPaths.has(fullPath)) {
                processedPaths.add(fullPath);
                results.push({
                    path: fullPath,
                    options: obj.$embeddedSchemaType.options
                });
            }
        }

        // Check for nested paths in complex schema objects
        if (obj.options && obj.options.type && obj.options.type.paths) {
            const nestedPaths = obj.options.type.paths;
            const parentPath = obj.path || currentPath;

            for (const [key, nestedObj] of Object.entries(nestedPaths)) {
                traverseObject(nestedObj, parentPath);
            }
        }

        // Check other nested structures
        if (obj.options && obj.options.type && typeof obj.options.type === 'object') {
            const parentPath = obj.path || currentPath;
            traverseObject(obj.options.type, parentPath);
        }
    }

    // Handle the comma-separated format in the provided data
    let jsonObjects:string[] = [];

    if (typeof data === 'string') {
        // Split by comma and clean up each JSON string
        const jsonStrings = data.split(',{').map((str, index) => {
            if (index === 0) return str.startsWith(',') ? str.slice(1) : str;
            return '{' + str;
        }).filter(str => str.trim());

        jsonObjects = jsonStrings;
    } else if (Array.isArray(data)) {
        jsonObjects = data.map(item=>typeof item === 'string' ? item : JSON.stringify(item));
    }

    // Process each JSON object
    for (const jsonString of jsonObjects) {
        try {
            const cleanJsonString = jsonString.trim();
            if (!cleanJsonString) continue;

            const obj = JSON.parse(cleanJsonString);
            traverseObject(obj);

        } catch (error) {
            console.error('Error parsing JSON:', error);
            continue;
        }
    }

    return results;
}