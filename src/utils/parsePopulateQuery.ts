export const parsePopulateArray = (populateArr: string[], selectArr: string[]) => {

    return populateArr.reduce((acc, curr)=>{
        const matched = selectArr.filter(item=> {
            const rgx = new RegExp(`^${curr}($|\.?)`);
            return rgx.test(item)
        })
        const pop = {path:curr}
        matched.forEach(item => {
            const str = item.slice(item.indexOf(".")+1)
            if(str === curr){return}

            const currSelect = {}
            if(str.startsWith("-")) { currSelect[str.slice(1).trim()] = 0}
            else {currSelect[str.trim()] = 1}
            pop["select"] = {...pop["select"], ...currSelect}
        })
        acc.push(pop)
        return acc
    },[] as {path: string, select?: any}[] )


}