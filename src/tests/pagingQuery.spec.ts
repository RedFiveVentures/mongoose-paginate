import { PagingQuery } from '../pagingQuery';
import { createRequest } from 'node-mocks-http';

const mockingoose = require('mockingoose');
import mongoose, { Schema, Model } from 'mongoose';

// Create a test schema and model
const TestSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const TestModel = mongoose.model('TestModel', TestSchema);

describe('PagingQuery', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('constructor', () => {
        test('should throw error if request is invalid', () => {
            expect(() => {
                new PagingQuery(null as any, TestModel);
            }).toThrow('Invalid request object: must have a query property');
        });

        test('should throw error if request has no query property', () => {
            expect(() => {
                new PagingQuery({} as any, TestModel);
            }).toThrow('Invalid request object: must have a query property');
        });

        test('should throw error if model is invalid', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new PagingQuery(req, null as any);
            }).toThrow('Invalid model: must be a Mongoose model');
        });

        test('should throw error if model does not have find function', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new PagingQuery(req, {} as any);
            }).toThrow('Invalid model: must be a Mongoose model');
        });

        test('should create instance with default params', () => {
            const req = createRequest({ query: {} });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$limit).toBe(25);
            expect(pq.params.$skip).toBe(0);
            expect(pq.params.$paging).toBe(true);
            expect(pq.params.$filter).toEqual({});
            expect(pq.params.$sort).toEqual([]);
            expect(pq.params.$populate).toEqual([]);
            expect(pq.params.$select).toBe('');
            expect(pq.params.$lean).toBe(false);
        });

        test('should parse filter from query string', () => {
            const req = createRequest({
                query: { $filter: '{"name":"John"}' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$filter).toEqual({ name: 'John' });
        });

        test('should parse limit and skip', () => {
            const req = createRequest({
                query: { $limit: '50', $skip: '10' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$limit).toBe(50);
            expect(pq.params.$skip).toBe(10);
        });

        test('should parse sort string', () => {
            const req = createRequest({
                query: { $sort: 'name 1, age -1' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$sort).toEqual([
                ['name', 1],
                ['age', -1]
            ]);
        });

        test('should parse populate array', () => {
            const req = createRequest({
                query: { $populate: 'author, books' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$populate).toEqual(['author', 'books']);
        });

        test('should parse paging false', () => {
            const req = createRequest({
                query: { $paging: 'false' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$paging).toBe(false);
        });

        test('should parse paging no', () => {
            const req = createRequest({
                query: { $paging: 'no' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$paging).toBe(false);
        });

        test('should parse paging 0', () => {
            const req = createRequest({
                query: { $paging: '0' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$paging).toBe(false);
        });

        test('should parse select string', () => {
            const req = createRequest({
                query: { $select: 'name,age,email' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$select).toBe('name,age,email');
        });

        test('should parse lean option', () => {
            const req = createRequest({
                query: { $lean: 'true' }
            });
            const pq = new PagingQuery(req, TestModel);

            expect(pq.params.$lean).toBe(true);
        });
    });

    describe('options', () => {
        test('should disable paging when disablePaging option is set', () => {
            const req = createRequest({ query: {} });
            const pq = new PagingQuery(req, TestModel, { disablePaging: true });

            expect(pq.params.$paging).toBe(false);
        });

        test('should disable paging when single option is set', () => {
            const req = createRequest({ query: {} });
            const pq = new PagingQuery(req, TestModel, { single: true });

            expect(pq.params.$paging).toBe(false);
        });

        test('should apply static filter', () => {
            const req = createRequest({
                query: { $filter: '{"name":"John"}' }
            });
            const pq = new PagingQuery(req, TestModel, {
                staticFilter: { active: true }
            });

            expect(pq.params.$filter).toEqual({ name: 'John' });
            expect(pq.options.staticFilter).toEqual({ active: true });
        });

        test('should disable filter when disableFilter option is set', () => {
            const req = createRequest({
                query: { $filter: '{"name":"John"}' }
            });
            const pq = new PagingQuery(req, TestModel, {
                disableFilter: true,
                staticFilter: { active: true }
            });

            expect(pq.options.disableFilter).toBe(true);
        });
    });

    describe('exec', () => {
        test('should execute query without paging and return results', async () => {
            const mockData = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
            mockingoose(TestModel).toReturn(mockData, 'find');

            const req = createRequest({
                query: { $paging: 'false' }
            });
            const pq = new PagingQuery(req, TestModel);
            const result = await pq.exec() as any[];

            // mockingoose adds additional fields like _id, createdAt, active
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({ name: 'John', age: 30 });
            expect(result[1]).toMatchObject({ name: 'Jane', age: 25 });
        });

        test('should execute query with paging and return paginated results', async () => {
            const mockData = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
            mockingoose(TestModel).toReturn(mockData, 'find');
            mockingoose(TestModel).toReturn(100, 'countDocuments');

            const req = createRequest({ query: {} });
            const pq = new PagingQuery(req, TestModel);
            const result = await pq.exec();

            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('totalRows');
            expect(result).toHaveProperty('rows');
            expect(result).toHaveProperty('limit');
            expect(result).toHaveProperty('skip');
            expect((result as any).limit).toBe(25);
            expect((result as any).skip).toBe(0);
        });

        test('should execute single query (findOne)', async () => {
            const mockData = { name: 'John', age: 30 };
            mockingoose(TestModel).toReturn(mockData, 'findOne');

            const req = createRequest({ query: {} });
            const pq = new PagingQuery(req, TestModel, { single: true });
            const result = await pq.exec() as any;

            // mockingoose adds additional fields like _id, createdAt, active
            expect(result).toMatchObject({ name: 'John', age: 30 });
        });
    });

    describe('error handling', () => {
        test('should throw error for invalid JSON in filter', () => {
            const req = createRequest({
                query: { $filter: 'invalid json' }
            });

            expect(() => {
                new PagingQuery(req, TestModel);
            }).toThrow('Invalid JSON in $filter parameter');
        });
    });
});
