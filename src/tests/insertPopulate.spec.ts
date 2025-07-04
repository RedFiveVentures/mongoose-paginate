import assert from "node:assert";
import {parsePopulateArray} from "../utils/parsePopulateQuery";



describe('parsePopulateQuery', () => {
    it('should return a populated path object', ()=>{
        const {pop, select} = {pop:['books'], select:[]}
        const [r1] = parsePopulateArray(pop, select)

        assert(r1.hasOwnProperty('path'), 'object does not contain path key')
        assert(!r1.hasOwnProperty('select'), 'object contains a select key')
        assert(r1.path === 'books','object contains expected value in path object')

    })
    it('should return a populated path and selectobject', ()=>{
        const {pop, select} = {pop:['books'], select:['books.items']}
        const [r1] = parsePopulateArray(pop, select)

        assert(r1.hasOwnProperty('path'), 'object does not contain path key')
        assert(r1.hasOwnProperty('select'), 'object contains a select key')
        assert(r1.path === 'books','object contains expected value in path object')
        assert(r1.select.hasOwnProperty('items'),  'object contains expected value in select object')
        assert(r1.select.items === 1,  'object contains expected value in select object')

    })
    it('should return a falsy 0 in the item select', ()=>{
        const {pop, select} = {pop:['books'], select:['books.-items']}
        const [r1] = parsePopulateArray(pop, select)
        assert(r1.hasOwnProperty('path'), 'object does not contain path key')
        assert(r1.hasOwnProperty('select'), 'object contains a select key')
        assert(r1.path === 'books','object contains expected value in path object')
        assert(r1.select.hasOwnProperty('items'),  'object contains expected value in select object')
        assert(r1.select.items === 0,  'object contains expected value in select object')

    })
    it('should return array with more than one item', ()=>{
        const {pop, select} = {pop:['books','author'], select:[]}
        const popArr = parsePopulateArray(pop, select)
        const [r1, r2] = popArr
        assert.equal(popArr.length,2, 'array has the proper length')
        assert(r1.hasOwnProperty('path'), 'object does not contain path key')
        assert(!r1.hasOwnProperty('select'), 'object contains a select key')
        assert(r1.path === 'books','object contains expected value in path object')
        assert(r2.hasOwnProperty('path'), 'object does not contain path key')
        assert(!r2.hasOwnProperty('select'), 'object contains a select key')
        assert(r2.path === 'author','object contains expected value in path object')


    })
    it('should return array with more than one item and select', ()=>{
        const {pop, select} = {pop:['books','author'], select:['books.items', 'author.-items.passage', 'author.test.passage']}
        const popArr = parsePopulateArray(pop, select)
        const [r1, r2] = popArr
        assert.equal(popArr.length,2, 'array has the proper length')
        assert(r1.hasOwnProperty('path'), 'object does not contain path key')
        assert(r1.hasOwnProperty('select'), 'object contains a select key')
        assert(r1.select.hasOwnProperty('items'), 'object contains a select key')
        assert(r1.path === 'books','object contains expected value in path object')
        assert(r1.select.items === 1,'object contains expected value in path object')

        assert(r2.hasOwnProperty('path'), 'object does not contain path key')
        assert(r2.hasOwnProperty('select'), 'object contains a select key')
        assert(r2.select.hasOwnProperty('items.passage'), 'object contains a select key')
        assert(r2.select.hasOwnProperty('test.passage'), 'object contains a select key')
        assert.equal(r2.select['items.passage'],0, 'objects select key is the correct value')
        assert.equal(r2.select['test.passage'],1, 'objects select key is the correct value')
        assert(r2.path === 'author','object contains expected value in path object')


    })
})