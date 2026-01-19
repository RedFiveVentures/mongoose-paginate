import {Model} from "mongoose";
import { buildFullPath, traverseSchemaObject } from './schemaTraversal';

export const findProtectedPaths = (model: Model<any>): string[] => {
    const schema = model.schema;
    const pathsSet = new Set<string>();

    schema.eachPath((path, schemaType) => {
        traverseSchemaObject(schemaType, (obj, currentPath) => {
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
        });
    });

    return Array.from(pathsSet);
};
