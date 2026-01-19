// Main classes
export { PagingQuery } from './pagingQuery'
export { AggregationPagingQuery } from './aggregationPagingQuery'

// Types
export type {
    RequestLike,
    QueryParameters,
    StandardParsedRequestParams,
    PagingQueryParsedRequestParams,
    AggregateQueryParsedRequestParams,
    StandardQueryOptions,
    PagingQueryOptions,
    AggregateQueryOptions
} from './types'

// Utilities - re-export for convenience
export { buildPopulate } from './utils/buildPopulateFromString'
export { parseSortString, parseAggregateSortString } from './utils/parseSortString'
export {
    getPropertyFromDotNotation,
    dotNotationToObject,
    createObjectFromDotNotation,
    setPropertyFromDotNotation,
    setPropertiesFromDotNotation,
    setPropertyFromDotNotationImmutable,
    setPropertiesFromDotNotationImmutable
} from './utils/dotNotation'
export { isJsonString } from './utils/isJsonString'
export { isValidDateString } from './utils/isValidDateString'
