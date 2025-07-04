export const getNestedProperty = (obj:any, path) => {

    return path.split('.').reduce((currentObject, key) => {
        return currentObject && currentObject[key];
    }, obj);
}
export const dotNotationToObject = (dotString, value:any)=> {
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
