import {SortOrder} from "mongoose";

export const parseSortString = (sortString: string) => {
    return sortString
        .split(",") //["_id 1","abc -1"]
        .map((item: string): [string, SortOrder]| null => {
            const [k, v] = item.trim().replace(/  +/g, " ").split(" ") //["_id","1"]
            if (!k && !v) {
                return null
            }
            if (k && !v) {
                return [k.trim(), 1]
            }
            let _order;
            if(isNaN(Number(v))) {
                _order = v.trim()
            } else {
                _order = Number(v)
            }

            const order  = [-1,1,'asc','desc'].includes(_order) ? _order : 1
            return [
                k.trim(),
                order as SortOrder
            ]
        })
        .filter((v) => v !== null)
}

export const parseAggregateSortString = (sortString):{[key:string]:SortOrder}=>{
    const sortObj = parseSortString(sortString)
    return sortObj.reduce((a, c) => {
        const [k, v] = c
        a[k] = v
        return a
    }, {} as any)
}