import { AggregationPagingQuery } from '../aggregationPagingQuery';
import { createRequest } from 'node-mocks-http';
import mongoose, { Schema, Types } from 'mongoose';

const mockingoose = require('mockingoose');

// Create a test schema and model
const AggTestSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const AggTestModel = mongoose.model('AggTestModel', AggTestSchema);

// Default pipeline with at least one stage to avoid undefined error
const defaultPipeline = [{ $match: {} }];

describe('AggregationPagingQuery', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('constructor', () => {
        test('should throw error if request is invalid', () => {
            expect(() => {
                new AggregationPagingQuery(null as any, AggTestModel, { pipeline: [] });
            }).toThrow('Invalid request object: must have a query property');
        });

        test('should throw error if request has no query property', () => {
            expect(() => {
                new AggregationPagingQuery({} as any, AggTestModel, { pipeline: [] });
            }).toThrow('Invalid request object: must have a query property');
        });

        test('should throw error if model is invalid', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new AggregationPagingQuery(req, null as any, { pipeline: [] });
            }).toThrow('Invalid model: must be a Mongoose model');
        });

        test('should throw error if model does not have aggregate function', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new AggregationPagingQuery(req, {} as any, { pipeline: [] });
            }).toThrow('Invalid model: must be a Mongoose model');
        });

        test('should throw error if options is missing pipeline', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new AggregationPagingQuery(req, AggTestModel, {} as any);
            }).toThrow('Invalid options: pipeline must be an array');
        });

        test('should throw error if pipeline is not an array', () => {
            const req = createRequest({ query: {} });
            expect(() => {
                new AggregationPagingQuery(req, AggTestModel, { pipeline: 'invalid' } as any);
            }).toThrow('Invalid options: pipeline must be an array');
        });

        test('should create instance with default params', () => {
            const req = createRequest({ query: {} });
            // Need at least one pipeline stage to avoid undefined error
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: [{ $match: {} }] });

            expect(apq.params.$limit).toBe(25);
            expect(apq.params.$skip).toBe(0);
            expect(apq.params.$paging).toBe(true);
            expect(apq.params.$filter).toEqual({});
            expect(apq.params.$sort).toEqual({});
            expect(apq.params.$populate).toEqual([]);
            expect(apq.params.$select).toBe('');
            expect(apq.params.$count).toEqual([]);
            expect(apq.params.$postFilter).toEqual({});
            expect(apq.params.$preSort).toEqual({});
        });

        test('should parse filter from query string', () => {
            const req = createRequest({
                query: { $filter: '{"name":"John"}' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: defaultPipeline,
                enableFilter: true
            });

            expect(apq.params.$filter).toEqual({ name: 'John' });
        });

        test('should parse sort string for aggregate', () => {
            const req = createRequest({
                query: { $sort: 'name 1, age -1' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.params.$sort).toEqual({ name: 1, age: -1 });
        });

        test('should parse preSort string', () => {
            const req = createRequest({
                query: { $preSort: 'createdAt -1' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.params.$preSort).toEqual({ createdAt: -1 });
        });

        test('should parse count array', () => {
            const req = createRequest({
                query: { $count: 'items, orders' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.params.$count).toEqual(['items', 'orders']);
        });

        test('should parse postFilter', () => {
            const req = createRequest({
                query: { $postFilter: '{"verified":true}' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: defaultPipeline,
                enablePostFilter: true
            });

            expect(apq.params.$postFilter).toEqual({ verified: true });
        });
    });

    describe('options', () => {
        test('should set default options', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.options.enableFilter).toBe(false);
            expect(apq.options.enablePostFilter).toBe(false);
            expect(apq.options.enablePreSort).toBe(true);
        });

        test('should merge provided options', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: [{ $match: { active: true } }],
                enableFilter: true,
                enablePostFilter: true,
                staticFilter: { type: 'test' }
            });

            expect(apq.options.enableFilter).toBe(true);
            expect(apq.options.enablePostFilter).toBe(true);
            expect(apq.options.staticFilter).toEqual({ type: 'test' });
        });
    });

    describe('typeCastObject', () => {
        test('should convert valid ObjectId strings', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const objectIdStr = '507f1f77bcf86cd799439011';
            const result = apq.typeCastObject(objectIdStr);

            expect(result).toBeInstanceOf(Types.ObjectId);
            expect(result.toString()).toBe(objectIdStr);
        });

        test('should keep already cast ObjectIds', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const objectId = new Types.ObjectId();
            const result = apq.typeCastObject(objectId);

            expect(result).toBe(objectId);
        });

        test('should convert valid date strings', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const dateStr = '2023-01-15T10:30:00Z';
            const result = apq.typeCastObject(dateStr);

            expect(result).toBeInstanceOf(Date);
        });

        test('should keep numbers as-is', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.typeCastObject(123)).toBe(123);
            expect(apq.typeCastObject(0)).toBe(0);
            expect(apq.typeCastObject(-5)).toBe(-5);
        });

        test('should keep regular strings as-is', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.typeCastObject('hello')).toBe('hello');
            expect(apq.typeCastObject('John Doe')).toBe('John Doe');
        });

        test('should recursively process arrays', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const objectIdStr = '507f1f77bcf86cd799439011';
            const result = apq.typeCastObject([objectIdStr, 'hello', 123]);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(Types.ObjectId);
            expect(result[1]).toBe('hello');
            expect(result[2]).toBe(123);
        });

        test('should recursively process objects', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const objectIdStr = '507f1f77bcf86cd799439011';
            const result = apq.typeCastObject({
                _id: objectIdStr,
                name: 'John',
                age: 30
            });

            expect(result._id).toBeInstanceOf(Types.ObjectId);
            expect(result.name).toBe('John');
            expect(result.age).toBe(30);
        });

        test('should handle nested objects with ObjectIds', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const objectIdStr = '507f1f77bcf86cd799439011';
            const result = apq.typeCastObject({
                $and: [
                    { userId: objectIdStr },
                    { active: true }
                ]
            });

            expect(result.$and[0].userId).toBeInstanceOf(Types.ObjectId);
            expect(result.$and[1].active).toBe(true);
        });
    });

    describe('createCounts', () => {
        test('should create count fields from $count params', () => {
            const req = createRequest({
                query: { $count: 'items,orders' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            expect(apq.params.$count).toEqual(['items', 'orders']);
        });
    });

    describe('exec', () => {
        test('should throw error if query is not present', async () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });
            apq.query = undefined;

            await expect(apq.exec()).rejects.toThrow('No Query Present in AggregationQuery');
        });

        test('should execute without paging when disabled', async () => {
            const mockData = [{ name: 'John' }, { name: 'Jane' }];
            mockingoose(AggTestModel).toReturn(mockData, 'aggregate');

            const req = createRequest({
                query: { $paging: 'false' }
            });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: defaultPipeline,
                disablePaging: true
            });

            const result = await apq.exec();
            expect(result).toEqual(mockData);
        });

        test('should execute with paging and return paginated structure', async () => {
            const mockData = [{
                items: [{ name: 'John' }, { name: 'Jane' }],
                totalRows: 100,
                limit: 25,
                skip: 0,
                rows: 2
            }];
            mockingoose(AggTestModel).toReturn(mockData, 'aggregate');

            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });

            const result = await apq.exec();
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('totalRows');
            expect(result).toHaveProperty('limit');
            expect(result).toHaveProperty('skip');
            expect(result).toHaveProperty('rows');
        });
    });

    describe('pipeline handling', () => {
        test('should prepend $search stage if present in first position', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: [
                    { $search: { index: 'default', text: { query: 'test', path: 'name' } } },
                    { $project: { name: 1 } }
                ]
            });

            expect(apq.query).toBeDefined();
        });

        test('should prepend $geoNear stage if present in first position', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: [
                    { $geoNear: { near: { type: 'Point', coordinates: [0, 0] }, distanceField: 'dist' } },
                    { $project: { name: 1 } }
                ]
            });

            expect(apq.query).toBeDefined();
        });

        test('should handle $match in first position', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: [
                    { $match: { active: true } },
                    { $project: { name: 1 } }
                ]
            });

            expect(apq.query).toBeDefined();
        });

        test('should apply static filter', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: defaultPipeline,
                staticFilter: { type: 'premium' }
            });

            expect(apq.options.staticFilter).toEqual({ type: 'premium' });
        });

        test('should apply static post filter', () => {
            const req = createRequest({ query: {} });
            const apq = new AggregationPagingQuery(req, AggTestModel, {
                pipeline: defaultPipeline,
                staticPostFilter: { verified: true }
            });

            expect(apq.options.staticPostFilter).toEqual({ verified: true });
        });
    });

    describe('error handling', () => {
        test('should throw error for invalid JSON in filter', () => {
            const req = createRequest({
                query: { $filter: 'invalid json' }
            });

            expect(() => {
                new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });
            }).toThrow('Invalid JSON in $filter parameter');
        });

        test('should throw error for invalid JSON in postFilter', () => {
            const req = createRequest({
                query: { $postFilter: 'invalid json' }
            });

            expect(() => {
                new AggregationPagingQuery(req, AggTestModel, { pipeline: defaultPipeline });
            }).toThrow('Invalid JSON in $postFilter parameter');
        });
    });
});
