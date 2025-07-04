
import assert from 'node:assert/strict';


const mockingoose = require('mockingoose')

import {PagingQuery} from '../pagingQuery';
import { createRequest, createResponse } from 'node-mocks-http';


const req = createRequest({query: {
    $filter:'{"a":123}',
    $sort:'name 1', '$populate':'books'}});



describe('PagingQuery', () => {
    beforeEach(() => {
        // Reset mockingoose before each test to ensure isolation
       // mockingoose.resetAll();
    });
    test('should have standard params on new', () => {
/*
        mockingoose(Author)
        const obj = new PagingQuery(req, Author, {sanitizeFilter: true})

        assert.equal(obj.params.$limit,25)*/
    })
})