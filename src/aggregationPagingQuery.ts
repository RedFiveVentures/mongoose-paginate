import {
    Model,
    Aggregate,
    Types,
    isObjectIdOrHexString,
    AggregateOptions,
    PipelineStage
} from "mongoose";
import type {AggregateQueryOptions, AggregateQueryParsedRequestParams, RequestLike} from './types'

import {parseParams} from "./utils/parseParams";
import {isJsonString} from "./utils/isJsonString";
import {isValidDateString} from "./utils/isValidDateString";
import {parseAggregateSortString, parseSortString} from "./utils/parseSortString";
import {findProtectedPaths} from "./utils/findProtectedPaths";

export class AggregationPagingQuery  {
    params:  AggregateQueryParsedRequestParams = {
        $filter: {},
        $limit: 25,
        $skip: 0,
        $sort: {},
        $paging: true,
        $populate: [] as string[],
        $select: "",
        $count: [],
        $postFilter: {},
        $preSort:{}

    }
    options: AggregateQueryOptions = {
        enableFilter: false,
        enablePostFilter: false,
        enablePreSort: true,
        removeProtected: false,
        pipeline: []
    }
    query: Aggregate<unknown[]> | undefined
    protectedPaths: string[] = []
    model: Model<any>
    constructor(req: RequestLike, model: Model<any>, options: AggregateQueryOptions) {
        if (!req || typeof req.query !== 'object') {
            throw new Error('Invalid request object: must have a query property')
        }
        if (!model || typeof model.aggregate !== 'function') {
            throw new Error('Invalid model: must be a Mongoose model')
        }
        if (!options || !Array.isArray(options.pipeline)) {
            throw new Error('Invalid options: pipeline must be an array')
        }
        this.options = {...this.options, ...options}
        this.model = model
        this.params = this.parseParams(this.params, req.query as import('qs').ParsedQs, true) as AggregateQueryParsedRequestParams

        if (this.options.removeProtected) {
            this.protectedPaths = this.findProtectedPaths(model)
        }

        this.initQuery()
    }
    findProtectedPaths = findProtectedPaths
    parseParams = parseParams
    isValidDateString = isValidDateString
    isJsonString = isJsonString
    parseSortString = parseSortString
    parseAggregateSortString = parseAggregateSortString
    createCounts = () => {
        const counts =  this.params.$count
        const addFieldsObj =counts.reduce((acc, curr) => {
            acc[`${curr}_count`] = {$size:`$${curr}`}
            return acc
        },{} as { [key: string]: { $size: string } })
        this.query?.addFields(addFieldsObj)
    }
    initQuery = async () => {
        const { $filter,  $sort, $preSort, $select, $count, $postFilter} = this.params
        const {
            enableFilter,
            enablePreSort,
            enablePostFilter,
            staticFilter,
            staticPostFilter,
            removeProtected,
            pipeline,
            ...options} = this.options
        this.query = this.model.aggregate()
        const [p1,...pipes] = pipeline
        const filterObj = {$and:[{...staticFilter}]}
        const postFilterObj = {$and:[{...staticPostFilter}]}
        let firstObj = false
        if(enableFilter) {filterObj.$and.push({...$filter})}
        if(p1 && (p1 as PipelineStage.Match).$match) {
            filterObj.$and.push({...(p1 as PipelineStage.Match).$match})
            firstObj = true
        }
        if(enablePostFilter) {postFilterObj.$and.push({...$postFilter})}

        const typeCastFilter = this.typeCastObject(filterObj)
        const typeCastPostFilter = this.typeCastObject(postFilterObj)
        if(p1 && Object.keys(p1).some(k=>["$search","$searchMeta", "$geoNear" ].includes(k))) {
            this.query.append(p1)
            firstObj = true
        }
        if (Object.keys(typeCastFilter).length !== 0) {
            this.query.match(typeCastFilter)
        }
        if (this.options.enablePreSort && Object.keys($preSort).length) {
            this.query.sort($preSort)
        }
        if(!firstObj && p1) {this.query.append(p1)}
            pipes.forEach(item => this.query?.append(item))

        if ($select) {
            this.query.project($select as any)
        }
        if (removeProtected) {
            this.removeProtectedFields()
        }
        if($count.length) {
            this.createCounts()
        }
        if((Object.keys($postFilter).length !== 0 && enablePostFilter) || staticPostFilter !== undefined){
            this.query.match(typeCastPostFilter)
        }
        if (Object.keys($sort).length) {
            this.query.sort($sort as Record<string, -1 | 1 | any>)
        }
        this.query.option({allowDiskUse: true, ...options as AggregateOptions})
    }
    typeCastObject = <T>(strOrObj: T): T => {

        if( strOrObj instanceof Types.ObjectId ) {
            return strOrObj
        }
        if (typeof strOrObj === "number" || !isNaN(strOrObj as number)) {
            return strOrObj
        }

        if (typeof strOrObj === "string" || strOrObj instanceof String) {
            const idObjectId = isObjectIdOrHexString(strOrObj)
            if (idObjectId) {
                return new Types.ObjectId(strOrObj as string) as T
            }

            if (this.isValidDateString(strOrObj as string)) {
                return new Date(strOrObj as string) as T
            }

            return strOrObj
        }

        if (Array.isArray(strOrObj)) {
            return strOrObj.map((item) => this.typeCastObject(item)) as T
        }

        const keys = Object.keys(strOrObj as object)

        const o = {} as Record<string, unknown>

        keys.forEach((k) => {
            o[k] = this.typeCastObject((strOrObj as Record<string, unknown>)[k])
        })

        return o as T
    }

    private removeProtectedFields = () => {
        const projections = this.protectedPaths.reduce((acc: Record<string, number>, curr: string) => {
            acc[curr] = 0
            return acc
        }, {} as Record<string, number>);

        if(Object.keys(projections).length > 0) {
            (this.query as Aggregate<unknown[]>).project(projections)
        }
    }
    exec = async () => {
        const { $skip, $limit, $paging, $filter } = this.params
        const { disablePaging } = this.options
        if(!this.query) {throw new Error("No Query Present in AggregationQuery")}

        if (!$paging || disablePaging) {
            this.query!.skip($skip)
            this.query!.limit($limit)
            return await this.query.exec()
        }

        const query = this.query as Aggregate<unknown[]>

        query.facet({
            items: [{ $skip: $skip },{ $limit: $limit }],
            paging: [
                { $count: "totalRows" },
                {
                    $addFields: { limit: $limit, skip: $skip }
                }
            ]
        })
        query.unwind( {path: "$paging", preserveNullAndEmptyArrays: true})
        query.project({
            items: 1,
            totalRows: {$ifNull:["$paging.totalRows",0]},
            limit: {$ifNull:["$paging.limit",$limit]},
            skip: {$ifNull:["$paging.skip",$skip]},
            rows: { $size: "$items" }
        })
        const req = await this.query.exec()
        return req[0]
    }

}