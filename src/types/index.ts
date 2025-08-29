
import mongoose, {QueryOptions, SortOrder, AggregateOptions} from "mongoose";
import {ParsedQs} from "qs";

export interface ExpressQuery extends ParsedQs {
    $filter: string;
    $limit: string;
    $skip: string;
    $sort: string;
    $paging: "yes" | "no" | "0" | "false"
    $populate: string;
    $includes: string;
    $select: string;
    $count: string;
}

export interface StandardParsedRequestParams {
    $filter?: { [key: string]: any }
    $limit: number
    $skip: number
    $paging?: boolean
    $populate?: string[]
    $includes?: string[] //deprecated
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
export interface AggregateQueryOptions extends StandardQueryOptions, Omit<AggregateOptions,'comment'> {

    disablePostFilter?: boolean,
    disablePreSort?: boolean,
    staticPostFilter?: { [key:string]: any }
    pipeline: mongoose.PipelineStage[]
}