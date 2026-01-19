export const getPropertyFromDotNotation = (obj:any, path:string) => {
    return path.split('.').reduce((currentObject, key) => {
        return currentObject && currentObject[key];
    }, obj);
}
export const dotNotationToObject = (dotString: string, value: unknown = null) => {
    const keys = dotString.split('.');
    const result = {};

    let current = result;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (i === keys.length - 1) {
            // Last key, assign the value
            current[key] = value;
        } else {
            // Not the last key, create nested object
            current[key] = {};
            current = current[key];
        }
    }

    return result;
}


export const  createObjectFromDotNotation = (dotNotationMap:{[key:string]:any})=> {
    const result = {};

    for (const [dotString, value] of Object.entries(dotNotationMap)) {
        const keys = dotString.split('.');
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i === keys.length - 1) {
                // Last key, assign the value
                current[key] = value;
            } else {
                // Not the last key, create nested object if it doesn't exist
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
        }
    }

    return result;
}

export const setPropertyFromDotNotation = (obj: Record<string, unknown>, path: string, value: unknown) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Target object must be a valid object');
    }

    if (!path || typeof path !== 'string') {
        throw new Error('Path must be a non-empty string');
    }

    const keys = path.split('.');
    let current = obj;

    // Navigate to the parent of the target property
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // If the property doesn't exist or isn't an object, create it
        if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
            current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
    }

    // Set the final property
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;

    return obj;
};

// Set multiple properties using dot notation map
export const setPropertiesFromDotNotation = (obj: Record<string, unknown>, dotNotationMap: Record<string, unknown>) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Target object must be a valid object');
    }

    if (!dotNotationMap || typeof dotNotationMap !== 'object') {
        throw new Error('Dot notation map must be a valid object');
    }

    for (const [path, value] of Object.entries(dotNotationMap)) {
        setPropertyFromDotNotation(obj, path, value);
    }

    return obj;
};


export const setPropertyFromDotNotationImmutable = (obj: Record<string, unknown>, path: string, value: unknown) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Target object must be a valid object');
    }

    if (!path || typeof path !== 'string') {
        throw new Error('Path must be a non-empty string');
    }

    const keys = path.split('.');
    const result = structuredClone(obj);
    let current = result;

    // Navigate to the parent of the target property
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // If the property doesn't exist or isn't an object, create it
        if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
            current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
    }

    // Set the final property
    const finalKey = keys[keys.length - 1];
    current[finalKey] = value;

    return result;
};

// Set multiple properties using dot notation map (immutable version)
export const setPropertiesFromDotNotationImmutable = (obj: Record<string, unknown>, dotNotationMap: Record<string, unknown>) => {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Target object must be a valid object');
    }

    if (!dotNotationMap || typeof dotNotationMap !== 'object') {
        throw new Error('Dot notation map must be a valid object');
    }

    const result = structuredClone(obj);

    for (const [path, value] of Object.entries(dotNotationMap)) {
        setPropertyFromDotNotation(result, path, value);
    }

    return result;
};
export type setPropertiesFromDotNotationImmutable = typeof setPropertiesFromDotNotationImmutable;
