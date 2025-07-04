export const findKeyWithValue = (obj, targetKey, targetValue)=> {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === targetKey && obj[key] === targetValue) {
                return true; // Key with matching value found
            }

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (findKeyWithValue(obj[key], targetKey, targetValue)) {
                    return true; // Found in a nested object
                }
            }
        }
    }
    return false; // Not found
}