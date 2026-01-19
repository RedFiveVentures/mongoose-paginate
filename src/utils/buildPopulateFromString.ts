
interface PopulateItem {
    path: string,
    select?: string,
    populate?: PopulateItem[]
}

interface PathSegment {
    name: string;
    select?: string;
}

interface PathGroup {
    select?: string;
    children: PathSegment[][];
}

const SEGMENT_PATTERN = /^([^\[]+)(?:\[([^\]]+)\])?$/;

// Private module-level functions
function splitPaths(str: string): string[] {
    const paths: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of str) {
        if (char === '[') depth++;
        else if (char === ']') depth--;

        if (char === ',' && depth === 0) {
            paths.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current) paths.push(current.trim());
    return paths;
}

function parseSegment(segment: string): PathSegment {
    const match = segment.match(SEGMENT_PATTERN);
    if (!match) return { name: segment };
    return {
        name: match[1],
        select: match[2]?.replace(/,/g, ' ')
    };
}

function processLevel(paths: PathSegment[][]): PopulateItem[] {
    if (!paths?.length) return [];

    const groups = {} as Record<string, PathGroup>;

    for (const [first, ...rest] of paths) {
        const key = first.name;
        if (!groups[key]) groups[key] = { select: first.select, children: [] };
        if (rest.length) groups[key].children.push(rest);
    }

    return Object.entries(groups).map(([key, { select, children }]) => {
        const obj = { path: key } as PopulateItem;
        if (select) obj.select = select;
        if (children.length) obj.populate = processLevel(children);
        return obj;
    });
}

// Only this is exported
export function buildPopulate(pathString: string): PopulateItem[] {
    if (!pathString) return [];

    const paths = splitPaths(pathString).map(p =>
        p.split('.').map(parseSegment)
    );

    return processLevel(paths);
}
