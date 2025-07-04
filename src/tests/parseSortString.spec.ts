import assert from 'node:assert/strict';


import {parseSortString} from "../utils/parseSortString";

describe('sortParser', () => {
    const testInputs = [
        "",
        "name",
        "name 1",
        "name -1",
        "name asc",
        "name desc",
        "name, address",
        "name, address 1",
        "name -1, address 1",
        "name -1, address desc",
        "name asc, address desc",
    ]
    it('should return empty array', () => {
        const fun = parseSortString("");
        assert(Array.isArray(fun));
        assert(fun.length === 0);
    });
    it('should return sort value of -1', () => {
        const fun = parseSortString("name -1");
        assert(Array.isArray(fun));
        assert(Array.length > 0)
        const [r1] = fun
        assert.strictEqual(r1[1], -1,'sortstring is not returning a negative value')


    });
    testInputs.forEach((value) => {


        it('should return a 2d matrix', () => {
            const fun = parseSortString(value);

            assert(Array.isArray(fun));
            assert(Array.length > 0)
            assert(fun.every(item => Array.isArray(item)));

        });
        it('should return sub arrays with length of 2', () => {
            const fun = parseSortString(value);
            assert(Array.isArray(fun));
            assert(Array.length > 0)
            assert(fun.every(item => Array.isArray(item) && item.length === 2), 'Every Item in sub arrays must have a length of 2');

        });
        it('should return sub arrays that have name:sortOrder', () => {
            const fun = parseSortString(value);
            assert(Array.isArray(fun));
            assert(Array.length > 0)
            assert(fun.every(item => {

                return typeof item[0] === 'string';
            }), 'Every Item in sub arrays must be a string');
            assert(fun.every(item => {
                return [-1, 1, 'asc', 'desc'].includes(item[1])

            }), 'Every Item in sub arrays must be one of `-1, 1, asc, desc`');

        });

    })
});
