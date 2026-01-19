import { parseParams } from '../utils/parseParams';
import type { PagingQueryParsedRequestParams, AggregateQueryParsedRequestParams } from '../types';

describe('parseParams', () => {
    const defaultPagingParams: PagingQueryParsedRequestParams = {
        $filter: {},
        $limit: 25,
        $skip: 0,
        $sort: [],
        $paging: true,
        $populate: [],
        $select: '',
        $lean: false
    };

    const defaultAggregateParams: AggregateQueryParsedRequestParams = {
        $filter: {},
        $limit: 25,
        $skip: 0,
        $sort: {},
        $paging: true,
        $populate: [],
        $select: '',
        $count: [],
        $postFilter: {},
        $preSort: {}
    };

    describe('basic parsing', () => {
        test('should return empty object for null params', () => {
            const result = parseParams(defaultPagingParams, null as any);
            expect(result).toEqual({});
        });

        test('should return default params when no matching keys', () => {
            const result = parseParams(defaultPagingParams, { unknownKey: 'value' });
            expect(result.$limit).toBe(25);
            expect(result.$skip).toBe(0);
        });
    });

    describe('$filter parsing', () => {
        test('should parse JSON filter string', () => {
            const result = parseParams(defaultPagingParams, { $filter: '{"name":"John"}' });
            expect(result.$filter).toEqual({ name: 'John' });
        });

        test('should handle complex filter object', () => {
            const filter = '{"$and":[{"age":{"$gt":18}},{"active":true}]}';
            const result = parseParams(defaultPagingParams, { $filter: filter });
            expect(result.$filter).toEqual({
                $and: [{ age: { $gt: 18 } }, { active: true }]
            });
        });

        test('should throw error for invalid JSON filter', () => {
            expect(() => {
                parseParams(defaultPagingParams, { $filter: 'invalid json' });
            }).toThrow('Invalid JSON in $filter parameter');
        });

        test('should pass through object filter', () => {
            const result = parseParams(defaultPagingParams, { $filter: { name: 'John' } as any });
            expect(result.$filter).toEqual({ name: 'John' });
        });
    });

    describe('$postFilter parsing', () => {
        test('should parse JSON postFilter string', () => {
            const result = parseParams(defaultAggregateParams, { $postFilter: '{"status":"active"}' }, true);
            expect((result as AggregateQueryParsedRequestParams).$postFilter).toEqual({ status: 'active' });
        });

        test('should throw error for invalid JSON postFilter', () => {
            expect(() => {
                parseParams(defaultAggregateParams, { $postFilter: 'invalid' }, true);
            }).toThrow('Invalid JSON in $postFilter parameter');
        });
    });

    describe('$limit and $skip parsing', () => {
        test('should parse limit as integer', () => {
            const result = parseParams(defaultPagingParams, { $limit: '50' });
            expect(result.$limit).toBe(50);
        });

        test('should parse skip as integer', () => {
            const result = parseParams(defaultPagingParams, { $skip: '100' });
            expect(result.$skip).toBe(100);
        });

        test('should handle string numbers', () => {
            const result = parseParams(defaultPagingParams, { $limit: '10', $skip: '20' });
            expect(result.$limit).toBe(10);
            expect(result.$skip).toBe(20);
        });

        test('should handle NaN values', () => {
            const result = parseParams(defaultPagingParams, { $limit: 'abc' });
            expect(Number.isNaN(result.$limit)).toBe(true);
        });
    });

    describe('$paging parsing', () => {
        test('should set paging false for "false"', () => {
            const result = parseParams(defaultPagingParams, { $paging: 'false' });
            expect(result.$paging).toBe(false);
        });

        test('should set paging false for "no"', () => {
            const result = parseParams(defaultPagingParams, { $paging: 'no' });
            expect(result.$paging).toBe(false);
        });

        test('should set paging false for "0"', () => {
            const result = parseParams(defaultPagingParams, { $paging: '0' });
            expect(result.$paging).toBe(false);
        });

        test('should set paging true for "true"', () => {
            const result = parseParams(defaultPagingParams, { $paging: 'true' });
            expect(result.$paging).toBe(true);
        });

        test('should set paging true for "yes"', () => {
            const result = parseParams(defaultPagingParams, { $paging: 'yes' });
            expect(result.$paging).toBe(true);
        });

        test('should be case insensitive', () => {
            const result = parseParams(defaultPagingParams, { $paging: 'FALSE' });
            expect(result.$paging).toBe(false);
        });
    });

    describe('$sort parsing', () => {
        test('should parse sort string for paging query', () => {
            const result = parseParams(defaultPagingParams, { $sort: 'name 1' });
            expect(result.$sort).toEqual([['name', 1]]);
        });

        test('should parse multiple sort fields', () => {
            const result = parseParams(defaultPagingParams, { $sort: 'name 1, age -1' });
            expect(result.$sort).toEqual([['name', 1], ['age', -1]]);
        });

        test('should parse sort string for aggregate query', () => {
            const result = parseParams(defaultAggregateParams, { $sort: 'name 1' }, true);
            expect(result.$sort).toEqual({ name: 1 });
        });

        test('should parse preSort for aggregate query', () => {
            const result = parseParams(defaultAggregateParams, { $preSort: 'createdAt -1' }, true);
            expect((result as AggregateQueryParsedRequestParams).$preSort).toEqual({ createdAt: -1 });
        });
    });

    describe('$count and $populate parsing', () => {
        test('should parse count as array', () => {
            const result = parseParams(defaultAggregateParams, { $count: 'items,orders' }, true);
            expect((result as AggregateQueryParsedRequestParams).$count).toEqual(['items', 'orders']);
        });

        test('should parse populate as array', () => {
            const result = parseParams(defaultPagingParams, { $populate: 'author,books' });
            expect(result.$populate).toEqual(['author', 'books']);
        });

        test('should trim whitespace from array items', () => {
            const result = parseParams(defaultPagingParams, { $populate: 'author , books , category' });
            expect(result.$populate).toEqual(['author', 'books', 'category']);
        });
    });

    describe('$select parsing', () => {
        test('should parse select string', () => {
            const result = parseParams(defaultPagingParams, { $select: 'name,age,email' });
            expect(result.$select).toBe('name,age,email');
        });

        test('should preserve select string as-is', () => {
            const result = parseParams(defaultPagingParams, { $select: '-password -secret' });
            expect(result.$select).toBe('-password -secret');
        });
    });

    describe('$lean parsing', () => {
        test('should set lean to true when present', () => {
            const result = parseParams(defaultPagingParams, { $lean: 'true' });
            expect((result as PagingQueryParsedRequestParams).$lean).toBe(true);
        });

        test('should set lean to true for any value', () => {
            const result = parseParams(defaultPagingParams, { $lean: 'anything' });
            expect((result as PagingQueryParsedRequestParams).$lean).toBe(true);
        });
    });

    describe('combined parsing', () => {
        test('should parse all params together', () => {
            const params = {
                $filter: '{"active":true}',
                $limit: '10',
                $skip: '5',
                $sort: 'name 1',
                $paging: 'true',
                $populate: 'author',
                $select: 'name,email',
                $lean: 'true'
            };

            const result = parseParams(defaultPagingParams, params) as PagingQueryParsedRequestParams;

            expect(result.$filter).toEqual({ active: true });
            expect(result.$limit).toBe(10);
            expect(result.$skip).toBe(5);
            expect(result.$sort).toEqual([['name', 1]]);
            expect(result.$paging).toBe(true);
            expect(result.$populate).toEqual(['author']);
            expect(result.$select).toBe('name,email');
            expect(result.$lean).toBe(true);
        });

        test('should parse aggregate params together', () => {
            const params = {
                $filter: '{"status":"active"}',
                $limit: '20',
                $skip: '10',
                $sort: 'createdAt -1',
                $preSort: 'priority 1',
                $postFilter: '{"verified":true}',
                $count: 'items',
                $select: 'name,status'
            };

            const result = parseParams(defaultAggregateParams, params, true) as AggregateQueryParsedRequestParams;

            expect(result.$filter).toEqual({ status: 'active' });
            expect(result.$limit).toBe(20);
            expect(result.$skip).toBe(10);
            expect(result.$sort).toEqual({ createdAt: -1 });
            expect(result.$preSort).toEqual({ priority: 1 });
            expect(result.$postFilter).toEqual({ verified: true });
            expect(result.$count).toEqual(['items']);
            expect(result.$select).toBe('name,status');
        });
    });
});
