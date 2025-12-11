import {
    Model,
    Aggregate,
    Types,
    isObjectIdOrHexString,
    AggregateOptions,
    PipelineStage
} from "mongoose";
import type {Request} from "express";
import type {AggregateQueryOptions, QueryParameters, AggregateQueryParsedRequestParams} from './types'

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
        $includes: [] as string[], // to be removed
        $select: "",
        $count: [],
        $postFilter: {},
        $preSort:{}

    }
    options: AggregateQueryOptions = {
        enableFilter: false,
        enablePostFilter:false,
        enablePreSort: true,
        pipeline: []
    }
    query: Aggregate<Array<any>> | undefined
    protectedPaths: string[] = []
    model: Model<any>
    constructor(req: Request<{},any, any, Partial<QueryParameters>>, model: Model<any>, options: AggregateQueryOptions) {
        this.options = {...this.options, ...options}
        this.model = model
        this.params = this.parseParams(this.params,req.query, true) as AggregateQueryParsedRequestParams


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
        if(Object.keys(p1).some(k=>["$search","$searchMeta", "$geoNear" ].includes(k))) {
            this.query.append(p1)
            firstObj = true
        }
        if (Object.keys(typeCastFilter).length !== 0) {
            this.query.match(typeCastFilter)
        }
        if (this.options.enablePreSort && Object.keys($preSort).length) {
            this.query.sort($preSort)
        }
        if(!firstObj) {this.query.append(p1)}
            pipes.forEach(item => this.query?.append(item))

        if ($select) {
            this.query.project($select as any)
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
    typeCastObject = (strOrObj: any): any => {

        if( strOrObj instanceof Types.ObjectId ) {
            return strOrObj
        }
        if (typeof strOrObj === "number" || !isNaN(strOrObj as any)) {
            return strOrObj
        }

        if (typeof strOrObj === "string" || strOrObj instanceof String) {
            const idObjectId = isObjectIdOrHexString(strOrObj)
            if (idObjectId) {
                return new Types.ObjectId(strOrObj as string)
            }

            if (this.isValidDateString(strOrObj as string)) {
                return new Date(strOrObj as string)
            }

            return strOrObj
        }

        if (Array.isArray(strOrObj)) {
            return strOrObj.map((item) => this.typeCastObject(item))
        }

        const keys = Object.keys(strOrObj)

        const o = {} as any

        keys.forEach((k) => {
            o[k] = this.typeCastObject(strOrObj[k])
        })

        return o
    }

    private removeProtectedFields = () => {
        const projections = this.protectedPaths.reduce((acc: any, curr: string) => {
            acc[curr] = 0
            return acc
        }, {} as any);

        if(Object.keys(projections).length > 0) {
            (this.query as Aggregate<any>).project(projections)
        }
    }
    exec = async () => {
        const { $skip, $limit, $paging, $filter } = this.params
        const { staticFilter } = this.options
        if(!this.query) {throw new Error("No Query Present in AggregationQuery")}

        if (!$paging) {
            this.query!.skip($skip)
            this.query!.limit($limit)
            return await this.query.exec()
        }

        const query = this.query as Aggregate<any>

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