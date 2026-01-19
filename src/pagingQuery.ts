import type {PagingQueryParsedRequestParams, PagingQueryOptions, RequestLike} from './types'
import { Model, QueryWithHelpers, SortOrder} from "mongoose";
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
        $sort: [] as [string, SortOrder][],
        $paging: true,
        $populate: [] as string[],
        $select: "",
        $lean: false
    }
    options: PagingQueryOptions = {}
    query: QueryWithHelpers<unknown, unknown> | null = null
    model: Model<any>

    constructor(req: RequestLike, model: Model<any>, options: Partial<PagingQueryOptions> = {}) {
        if (!req || typeof req.query !== 'object') {
            throw new Error('Invalid request object: must have a query property')
        }
        if (!model || typeof model.find !== 'function') {
            throw new Error('Invalid model: must be a Mongoose model')
        }
        this.options = options
        this.model = model
        this.params = this.parseParams(this.params, req.query as import('qs').ParsedQs) as PagingQueryParsedRequestParams
        this.initQuery()
    }
    private isJsonString = isJsonString
    private initQuery = () => {
        const {$filter, $sort, $select, $skip, $limit, $populate, $lean} = this.params
        const {single, staticFilter, disablePaging, disableFilter, ...options} = this.options
        const filter = disableFilter ? {...staticFilter} : {...$filter, ...staticFilter}

        this.query = (single ? this.model.findOne(filter) : this.model.find(filter)) as QueryWithHelpers<unknown, unknown>
        this.query!.setOptions(options)

        if (disablePaging || single) {
            this.params.$paging = false
        }

        if ($sort && $sort.length > 0) {
            this.query!.sort($sort)
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
            this.query!.lean()
        }
        this.query!.skip($skip).limit($limit)

    }
    parseSortString = parseSortString
    parseParams = parseParams
    exec = async () => {
        const {$skip, $limit, $paging, $filter} = this.params
        const {staticFilter} = this.options
        if (!$paging) {
            return await (this.query! as QueryWithHelpers<unknown, unknown>).exec()
        }

        const resObj = {
            totalRows: 0,
            rows: 0,
            limit: $limit,
            skip: $skip,
            items: [] as unknown[]
        }

        resObj.items = await (this.query! as QueryWithHelpers<unknown[], unknown>).exec() as unknown[]
        resObj.totalRows = await this.model.countDocuments({
            ...$filter,
            ...staticFilter
        })

        resObj.rows = resObj.items.length
        return resObj
    }
}

