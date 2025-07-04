import {dotNotationToObject} from "../utils/getNestedProperty";

describe ("setNestedProperty", () => {
    test('validate change on object',()=>{
        const obj = {a:{b:1,c:1}}
        const str = 'a.b'
        const value = 2
        const result = dotNotationToObject(str, value)
        console.log(result)
        expect(result).toEqual({a:{b:2,c:1}})
    })
})