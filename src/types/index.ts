
import mongoose, {QueryOptions, SortOrder, AggregateOptions} from "mongoose";
import {ParsedQs} from "qs";

/**
 * Minimal request interface that only requires a query property.
 * This allows consumers to use custom Express request types without
 * running into index signature compatibility issues.
 */
export interface RequestLike {
    query: ParsedQs | Record<string, unknown>;
}

export interface QueryParameters extends ParsedQs {
    $filter: string;
    $limit: string;
    $skip: string;
    $sort: string;
    $paging: "yes" | "no" | "0" | "false"
    $populate: string;
    $select: string;
    $count: string;
}

export interface StandardParsedRequestParams {
    $filter?: { [key: string]: any }
    $limit: number
    $skip: number
    $paging?: boolean
    $populate?: string[]
    $select?: string
}

export interface PagingQueryParsedRequestParams extends StandardParsedRequestParams {
    $lean?: boolean
    $sort?: [string, SortOrder][]

}
export interface AggregateQueryParsedRequestParams extends StandardParsedRequestParams {
    $preSort: { [key: string]: SortOrder }
    $sort: { [key: string]: SortOrder }
    $count: string[]
    $postFilter: {[key:string]:any}
}
export interface StandardQueryOptions extends QueryOptions {
    disablePaging?: boolean,
    disableFilter?: boolean
}

export interface PagingQueryOptions extends StandardQueryOptions {
    staticFilter?: { [key: string]: any }
    single?: boolean,
}

export interface AggregateQueryOptions extends Omit<AggregateOptions,'comment'> {
    enableFilter?: boolean,
    disablePaging?: boolean,
    disablePostFilter?: boolean,
    disablePreSort?: boolean,
    enablePostFilter?: boolean,
    enablePreSort?: boolean,
    staticFilter?: { [key: string]: any }
    staticPostFilter?: { [key:string]: any }
    removeProtected?: boolean,
    pipeline: mongoose.PipelineStage[]
}