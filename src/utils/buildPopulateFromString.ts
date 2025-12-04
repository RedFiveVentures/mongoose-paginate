
interface PopulateItem {
    path: string,
    select?: string,
    populate?: PopulateItem[]
}

export function buildPopulate(pathString):PopulateItem[] {
    if (!pathString) return [];

    const splitPaths = (str:string) => {
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
    };

    const parseSegment = (segment) => {
        const match = segment.match(/^([^\[]+)(?:\[([^\]]+)\])?$/);
        if (!match) return { name: segment };
        return {
            name: match[1],
            select: match[2]?.replace(/,/g, ' ')
        };
    };

    const paths = splitPaths(pathString).map(p =>
        p.split('.').map(parseSegment)
    );

    const processLevel = (paths) => {
        const groups = {} as Record<string, { select?: string, children: string[][] }>;

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
    };

    return processLevel(paths);
}