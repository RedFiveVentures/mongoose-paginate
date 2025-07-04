import {ParsedQs} from "qs";
import type {PagingQueryParsedRequestParams, AggregateQueryParsedRequestParams} from '../index.d'
import {parseAggregateSortString, parseSortString} from "./parseSortString";

export const parseParams = (defaultParams: PagingQueryParsedRequestParams | AggregateQueryParsedRequestParams, params: ParsedQs, isAggregate = false): PagingQueryParsedRequestParams | AggregateQueryParsedRequestParams => {
    if (!params) {
        return {} as any
    }
    const keys = Object.keys(params)
    const __params = structuredClone(defaultParams)
    const parsedParams = {...defaultParams};
    keys.forEach((k) => {
        if (__params.hasOwnProperty(k)) {
            if (k === "$filter" || k === "$postFilter") {
                parsedParams[k] =
                    typeof params[k] === "string"
                        ? JSON.parse(params[k] as string)
                        : params[k]
            }
            if (k === "$limit" || k === "$skip") {
                parsedParams[k] = parseInt(params[k]!.toString())
            }
            if (k === "$paging") {
                const str = (params[k] as string).toLowerCase()
                parsedParams[k] = str === 'false' || str === 'no' || str == '0'
            }
            if (k === "$sort" || k === "$preSort") {
                parsedParams[k] = isAggregate ? parseAggregateSortString(params[k] as string) : parseSortString(params[k] as string)
            }

            if (k === "$count" || k === "$includes" || k === "$populate") {
                const v = (params[k] as string).split(",").map((v) => v.trim())
                if (k === "$includes") {
                    parsedParams["$populate"] = v
                } else {
                    (parsedParams as any)[k] = v
                }
            }
            if (k === "$select") {
                parsedParams[k] = params[k] as string
            }
            if (k === "$lean") {
                parsedParams[k] = true
            }
        }
    })

    return parsedParams
}

