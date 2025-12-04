import type {PagingQueryParsedRequestParams, PagingQueryOptions} from './types'
import { Model, QueryWithHelpers} from "mongoose";
import type {Request} from 'express'
import {parseSortString} from "./utils/parseSortString";
import {parsePopulateArray} from "./utils/parsePopulateQuery";
import {buildPopulate} from "./utils/buildPopulateFromString"
import {parseParams} from "./utils/parseParams";

import {isJsonString} from "./utils/isJsonString";


export class PagingQuery {
    params: PagingQueryParsedRequestParams = {
        $filter: {},
        $limit: 25,
        $skip: 0,
        $sort: [] as any[],
        $paging: true,
        $populate: [] as string[],
        $includes: [] as string[], // to be removed
        $select: "",
        $lean: false
    }
    options: PagingQueryOptions = {}
    query: QueryWithHelpers<any, any> | null = null
    model: Model<any>

    constructor(req: Request, model: Model<any>, options: Partial<PagingQueryOptions> = {}) {
        this.options = options
        this.model = model
        this.params = this.parseParams(this.params, req.query) as PagingQueryParsedRequestParams
        this.initQuery()
    }
    private isJsonString = isJsonString
    private initQuery = () => {
        const {$filter, $sort, $select, $skip, $limit, $populate, $lean} = this.params
        const {single, staticFilter, disablePaging, enableFilter, ...options} = this.options
        const filter = enableFilter ? {...staticFilter} : {...$filter, ...staticFilter}

        this.query = single ? this.model.findOne(filter) : this.model.find(filter)
        this.query.setOptions(options)

        if (disablePaging || single) {
            this.params.$paging = false
        }

        if ($sort && $sort.length > 0) {
            this.query.sort($sort)
        }

        if ($populate) {
            const popArr = buildPopulate($populate.join(","))
            popArr.forEach(path => {
                this.query!.populate(path)
            })
        }
        if ($select) {
            let selectStr = $select
            if (!this.isJsonString($select)) {
                selectStr = $select
                    .split(",")
                    .filter(item => !($populate || []).some(p => item.trim().startsWith(p)))
                    .join(" ")
            }
            this.query!.select(selectStr)
        }
        if ($lean) {
            this.query.lean()
        }
        this.query!.skip($skip).limit($limit)

    }
    parseSortString = parseSortString
    parseParams = parseParams
    exec = async () => {
        const {$skip, $limit, $paging, $filter} = this.params
        const {staticFilter} = this.options
        if (!$paging) {
            return await (this.query! as QueryWithHelpers<any, any>).exec()
        }

        const resObj = {
            totalRows: 0,
            rows: 0,
            limit: $limit,
            skip: $skip,
            items: [] as any[]
        }

        resObj.items = await (this.query! as QueryWithHelpers<any, any>).exec()
        resObj.totalRows = await this.model.countDocuments({
            ...$filter,
            ...staticFilter
        })

        resObj.rows = resObj.items.length
        return resObj
    }
}

