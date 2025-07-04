import {Model} from "mongoose";

export const findProtectedPaths = (model: Model<any>): string[] => {
    const schema = model.schema
    const data:any[] = []
    schema.eachPath((p,i)=>{
        const str = JSON.stringify(i)

        data.push(str)
    })
    const pathsSet = new Set<string>();

    function buildFullPath(parentPath, childPath) {
        if (!parentPath) return childPath;
        if (!childPath) return parentPath;
        return `${parentPath}.${childPath}`;
    }

    // Recursive function to traverse nested objects and find selected: false
    function traverseObject(obj, currentPath = '') {
        // Check if current object has selected === false
        if (obj.selected === false && obj.path) {
            const fullPath = buildFullPath(currentPath, obj.path);
            pathsSet.add(fullPath);
        }

        // Check options.selected
        if (obj.options && obj.options.selected === false && obj.path) {
            const fullPath = buildFullPath(currentPath, obj.path);
            pathsSet.add(fullPath);
        }

        // Check for nested paths in complex schema objects
        if (obj.options && obj.options.type && obj.options.type.paths) {
            const nestedPaths = obj.options.type.paths;
            const parentPath = obj.path || currentPath;

            for (const [key, nestedObj] of Object.entries<any>(nestedPaths)) {
                if (nestedObj.selected === false) {
                    const fullPath = buildFullPath(parentPath, nestedObj.path);
                    pathsSet.add(fullPath);
                }

                // Recursively traverse nested objects
                traverseObject(nestedObj, parentPath);
            }
        }

        // Check other nested structures that might contain paths
        if (obj.options && obj.options.type && typeof obj.options.type === 'object') {
            const parentPath = obj.path || currentPath;
            traverseObject(obj.options.type, parentPath);
        }
    }

    // Iterate through each JSON string in the array
    for (const jsonString of data) {
        try {
            // Parse the JSON string
            const obj = JSON.parse(jsonString);

            // Start traversal from root
            traverseObject(obj);

        } catch (error) {
            console.error('Error parsing JSON:', error);
            continue;
        }
    }

    // Convert Set back to Array and return
    return Array.from(pathsSet);
}