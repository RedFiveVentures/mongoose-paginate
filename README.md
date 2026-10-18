

@r5v/mongoose-pagination is a powerful yet lightweight utility that bridges the gap between HTTP query parameters and MongoDB queries. It provides an intuitive wrapper around Mongoose models, allowing you to easily transform Express request objects into sophisticated database queries with pagination, filtering, and sorting capabilities.

Simple, Fast, Efficient

This project was designed to accomodate more than 80% of your daily workflow to remove the overhead of boilerplate code in handling each endpoint and keeping queries and query params simple. We didn't want you to have to learn a new language to use this product

## Requirements
- Node.js >= 20
- mongoose >= 8.0.0 (peer dependency)
  - Tested with: 8.16.0, 9.1.4

## Basic Usage

### PagingQuery
```typescript
// userController.ts
import {PagingQuery} from '@r5v/mongoose-paginate'
import {UserModel} from "./models"

const getUsersController: RequestHandler = async (res, res) => {
    
    const query = new PagingQuery(req, User, {})
    const users = await query.exec()
    
    res.send(users)
}
```

#### Results

```
{
    totalRows: 0,
    rows: 0,
    limit: 25,
    skip: 0,
    items: [ <UserObject>]
}
```

### AggregationPagingQuery
```typescript
// userController.ts
import {AggregationPagingQuery} from '@r5v/mongoose-paginate'
import {UserModel} from "./models"

const getUsersController: RequestHandler = async (res, res) => {
    
    const query = new AggregationPagingQuery(req, User, {
        pipeline: [ {$match:{name:/^Steve/}}]
    })
    const users = await query.exec()
    
    res.send(users)
}
```

#### Results

```
{
    totalRows: 0,
    rows: 0,
    limit: 25,
    skip: 0,
    items: [ <UserObject>]
}
```

### Definition

PagingQuery(Express.Request, mongoose.Model, options )

#### Query Parameters

| Name        | Value                                                                             | Description                                                                                                                                                                                                    | Class Availability                  |
|:------------|:----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| $filter     | Mongo Filter Object                                                               | any json string can be passed in this parameter. be sure to turn on sanitizeFilter if you allow dynamic filters                                                                                                | PagingQuery, AggregationPagingQuery |
| $limit      | number                                                                            | limit the number of returned objects                                                                                                                                                                           | PagingQuery, AggregationPagingQuery |
| $skip       | number                                                                            | skip to the next object on the request                                                                                                                                                                         | PagingQuery, AggregationPagingQuery |
| $paging     | 'false'\|0\|'no'                                                                  | turn off paging, on by default                                                                                                                                                                                 | PagingQuery, AggregationPagingQuery |
| $populate   | comma separated dot notation string \n books,publishers                           | using refs and virtuals, a dot notation string will populate the model using .populate. will deep populate and select using \"authors\[name\].books\[title\],publishers\[name\]" notation                      | PagingQuery                         |
| $select     | comma separated dot notation string \n books,-_id \| -_id,-name,address.-address1 | using the select notation uses the mongoose name \| -name syntax to filter the output. use this in conjunction with the $populate query to filter keys \n ie books.title,books.publisher \| -name,books.-title | PagingQuery, AggregationPagingQuery |   
| $lean       | no value needed, this will return a lean query result                             | returns a lean result. does not require a value                                                                                                                                                                | PagingQuery                         |   
| $sort       | space separated mongoose sort string \n name -value                               | inserts sort into the query. In aggregation queries this will insert a sort after the existing pipeline                                                                                                        | PagingQuery, AggregationPagingQuery | 
| $preSort    | comma separated dot notation string \n books,-_id \| -_id,-name,address.-address1 | in aggregate queries this will insert a sort object after the initial match in the pipeline.                                                                                                                   | AggregationPagingQuery              |
| $count      | comma separated dot notation string                                               | this comma separate string will traverse the results and insert a new field  with the $size of the selected key/value . this new name field will be appended with `_count`                                     | AggregationPagingQuery              |   
| $postFilter | Any Json Object                                                                   | creates and additional filter and in aggregation queries is appended to the end of the pipeline                                                                                                                | AggregationPagingQuery              |

#### Example URLs

```bash
# Basic pagination
GET /api/books?$limit=10&$skip=20

# Filter by field (JSON format)
GET /api/books?$filter={"genre":"Horror"}

# Filter with operators
GET /api/books?$filter={"price.amount":{"$gte":20,"$lte":50}}

# Sort (space-separated: field direction)
GET /api/books?$sort=price.amount%20desc
GET /api/books?$sort=title%20asc,createdAt%20desc

# Select specific fields
GET /api/books?$select=title,isbn,price

# Populate references
GET /api/books?$populate=author,publisher

# Deep populate with field selection
GET /api/books?$populate=author[firstName,lastName],publisher[name]

# Aggregation with preSort (sorts before pipeline)
GET /api/books?$preSort=createdAt%20desc

# Aggregation with postFilter (filters on computed fields)
GET /api/books?$postFilter={"priceCategory":"expensive"}

# Count array fields
GET /api/books?$count=authors,tags
# Result includes: authors_count, tags_count

# Disable paging (returns array instead of paged object)
GET /api/books?$paging=false

# Lean query (returns plain objects)
GET /api/books?$lean=true
```

#### Options

| Key                         | Value                | Description                                                                                                                                                              | Class Availability                  | Required | Default |
|:----------------------------|:---------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------|:---------|:--------|
| disablePaging               | boolean              | disables paging and $paging param use                                                                                                                                    | PagingQuery, AggregationPagingQuery |          | false   |
| disableFilter               | boolean              | disables the $filter param on req.                                                                                                                                       | PagingQuery                         |          | false   |
| enableFilter                | boolean              | enables the $filter param on req for aggregation queries.                                                                                                                | AggregationPagingQuery              |          | false   |
| enablePreSort               | boolean              | enables the $preSort param on req for aggregation queries.                                                                                                               | AggregationPagingQuery              |          | false   |
| single                      | boolean              | disables paging on the query. converts from .find query to .findOne()                                                                                                    | PagingQuery                         |          | false   |
| enablePostFilter            | boolean              | enables the ability to create a dynamic filter per request using the $postFilter parameter                                                                               | AggregationPagingQuery              |          | false   |
| staticPostFilter            | Mongo Filter Object  | create a filter on the pipeline that is added after all the pipeline stages. this cannot be overwritten by params                                                        | AggregationPagingQuery              |          | {}      |
| staticFilter                | Mongo Filter Object  | create a filter on the pipeline that is added before all the pipeline stages. on find requests, this is added to the filter object. this cannot be overwritten by params | AggregationPagingQuery              |          | {}      |
| pipeline                    | MongoPipelineStage[] | pipeline request object. if the first item in pipeline stage is a $match or another required first stage operator. it will be placed before all other modifiers          | AggregationPagingQuery              | true     | []      |
| removeProtected             | boolean              | **EXPERIMENTAL** - auto remove protected fields (those with `select: false` in schema) from aggregation results. Use with caution and test thoroughly in your environment | AggregationPagingQuery              |          | false   |

## Utilities

All utilities can be imported directly from the main package or from the `/utils` subpath:

```typescript
// Direct import
import { buildPopulate, parseSortString, getPropertyFromDotNotation } from '@r5v/mongoose-paginate'

// Subpath import (all utilities)
import * as utils from '@r5v/mongoose-paginate/utils'
```

### Populate Utilities

| Name | Signature | Description |
|:-----|:----------|:------------|
| `buildPopulate` | `(pathString: string) => PopulateItem[]` | Creates a Mongoose populate object from dot notation string. Supports deep population with field selection using bracket notation: `"author[name].books[title],publisher[name]"` |

```typescript
import { buildPopulate } from '@r5v/mongoose-paginate'

const populate = buildPopulate('author[name,email].books[title],publisher')
// Result: [
//   { path: 'author', select: 'name email', populate: [{ path: 'books', select: 'title' }] },
//   { path: 'publisher' }
// ]
```

### Sort Utilities

| Name | Signature | Description |
|:-----|:----------|:------------|
| `parseSortString` | `(sortString: string) => [string, SortOrder][]` | Parses a sort string into Mongoose sort array format. Example: `"name -createdAt"` → `[["name", 1], ["createdAt", -1]]` |
| `parseAggregateSortString` | `(sortString: string) => {[key: string]: SortOrder}` | Parses a sort string into aggregation pipeline sort object. Example: `"name -createdAt"` → `{ name: 1, createdAt: -1 }` |

```typescript
import { parseSortString, parseAggregateSortString } from '@r5v/mongoose-paginate'

const sortArray = parseSortString('name 1, createdAt -1')
// Result: [["name", 1], ["createdAt", -1]]

const sortObj = parseAggregateSortString('name 1, createdAt -1')
// Result: { name: 1, createdAt: -1 }
```

### Dot Notation Utilities

| Name | Signature | Description |
|:-----|:----------|:------------|
| `getPropertyFromDotNotation` | `(obj: any, path: string) => any` | Gets a nested property value using dot notation path |
| `dotNotationToObject` | `(dotString: string, value?: unknown) => object` | Converts a dot notation string to a nested object |
| `createObjectFromDotNotation` | `(dotNotationMap: {[key: string]: any}) => object` | Creates a nested object from multiple dot notation key-value pairs |
| `setPropertyFromDotNotation` | `(obj: Record<string, unknown>, path: string, value: unknown) => object` | Sets a nested property value (mutates original object) |
| `setPropertiesFromDotNotation` | `(obj: Record<string, unknown>, dotNotationMap: Record<string, unknown>) => object` | Sets multiple nested properties (mutates original object) |
| `setPropertyFromDotNotationImmutable` | `(obj: Record<string, unknown>, path: string, value: unknown) => object` | Sets a nested property value (returns new object) |
| `setPropertiesFromDotNotationImmutable` | `(obj: Record<string, unknown>, dotNotationMap: Record<string, unknown>) => object` | Sets multiple nested properties (returns new object) |

```typescript
import {
  getPropertyFromDotNotation,
  dotNotationToObject,
  setPropertyFromDotNotation
} from '@r5v/mongoose-paginate'

// Get nested value
const user = { profile: { name: 'John', address: { city: 'NYC' } } }
getPropertyFromDotNotation(user, 'profile.address.city') // 'NYC'

// Create nested object from dot notation
dotNotationToObject('user.profile.name', 'John')
// Result: { user: { profile: { name: 'John' } } }

// Set nested property
const obj = { user: { name: 'John' } }
setPropertyFromDotNotation(obj, 'user.email', 'john@example.com')
// Result: { user: { name: 'John', email: 'john@example.com' } }
```

### Validation Utilities

| Name | Signature | Description |
|:-----|:----------|:------------|
| `isJsonString` | `(str: string) => boolean` | Checks if a string is valid JSON |
| `isValidDateString` | `(value: string) => boolean` | Checks if a string is a valid ISO 8601 date format |

```typescript
import { isJsonString, isValidDateString } from '@r5v/mongoose-paginate'

isJsonString('{"name": "John"}')  // true
isJsonString('invalid')           // false

isValidDateString('2024-01-15')                    // true
isValidDateString('2024-01-15T10:30:00.000Z')     // true
isValidDateString('invalid-date')                  // false
```

### Schema Traversal Utilities

| Name | Signature | Description |
|:-----|:----------|:------------|
| `buildFullPath` | `(parentPath: string, childPath: string) => string` | Builds a dot-notation path from parent and child segments |
| `traverseSchemaObject` | `(obj: any, callback: (obj, path) => void, currentPath?: string) => void` | Recursively traverses a Mongoose schema object, calling callback for each node |

```typescript
import { buildFullPath, traverseSchemaObject } from '@r5v/mongoose-paginate'

// Build dot-notation paths
buildFullPath('user', 'profile')      // 'user.profile'
buildFullPath('', 'name')             // 'name'
buildFullPath('parent', '')           // 'parent'

// Traverse schema objects
traverseSchemaObject(schemaType, (obj, currentPath) => {
  if (obj.options?.ref) {
    console.log(`Found ref at ${currentPath}: ${obj.options.ref}`)
  }
})
```

## Types

All TypeScript types are exported and can be imported:

```typescript
import type {
  PagingQueryOptions,
  AggregateQueryOptions,
  QueryParameters,
  PagingQueryParsedRequestParams,
  AggregateQueryParsedRequestParams
} from '@r5v/mongoose-paginate'

// Or from the types subpath
import type * from '@r5v/mongoose-paginate/types'
```

## Build

```text
### build and run test server

$ yarn 
$ yarn run build
$ cd test_server
$ yarn
$ yarn add ../ #adds the package to the local server
$ echo MONGODB_URI=http://localhost:27017/bookstore >> .env
$ yarn run seed 
  ### load seed data into bookstore database
$ yarn run start
```


#### Aggregations Order of operations

1. First pipeline stage (if `$search`, `$searchMeta`, or `$geoNear`)
2. `$match` combining: `staticFilter` + `$filter` (if `enableFilter`) + first pipeline `$match` stage
3. `$preSort` (if `enablePreSort` is true)
4. Remaining pipeline stages
5. `$select` / `$project`
6. `$count` (adds `_count` fields for array sizes)
7. `$postFilter` combining: `staticPostFilter` + `$postFilter` (if `enablePostFilter`)
8. `$sort` (final sorting, can sort on computed fields)
9. Apply pagination (`$skip`, `$limit`) and options


## Versioning and releasing

The package follows [semver](https://semver.org). The version in `package.json` is the only version; it is bumped in its own commit (`chore: bump version to X.Y.Z`) and every release gets an entry in the changelog below.

**What each part means**

| Bump | When | Examples |
|:--|:--|:--|
| patch `1.0.x` | Bug fixes, docs, and type fixes that do not narrow what consumers can already write | `exec()` returns `Promise<any>` again; a regex bug in populate parsing |
| minor `1.x.0` | New options, parameters, exports or utilities; anything additive | a new `allowedOperators` option |
| major `x.0.0` | Anything that can break a consumer's build **or** behaviour | removing a parameter (`$includes`), changing a default, raising the minimum `mongoose` or Node version, **narrowing a public type** (`any` to `unknown`, a stricter argument type) |

Types are part of the public API. A change that makes a consumer's TypeScript stop compiling is a breaking change even if the runtime is identical. Consumers pin `^1.0.x`, so a breaking change shipped as a patch reaches them on the next install.

**Release steps** (from a clean `main`, after the PR is merged)

```text
$ git checkout main && git pull
$ npm version patch --no-git-tag-version      # or: minor / major
$ git commit -am "chore: bump version to X.Y.Z"
$ git push
$ npm install
$ npm test                                    # must be green
$ npm run build                               # prebuild clears dist/, postbuild copies package.json + README into it
$ npm pack --dry-run                          # check the file list: package.json, README.md, dist/**
$ npm login                                   # once per machine; opens the browser
$ npm publish --access public                 # add --otp=123456 if npm asks for a code
$ npm view @r5v/mongoose-paginate version     # confirm X.Y.Z is live
```

Notes:
- Publish only after `npm run build`. There is no `prepublishOnly` script, and `dist/` is what consumers get (`files` in `package.json`).
- Update the changelog in the same PR as the change, under the version it will ship as.
- Before a release that touches types or parsing, run the consuming app (`theshopkeeper`) against the built `dist/`: copy it over `node_modules/@r5v/mongoose-paginate/dist`, then run its `tsc` and tests. The 1.0.14 narrowing of `exec()` to `unknown` was only caught this way.
- A published version cannot be changed or re-used. If a release is wrong, publish a fixed patch and `npm deprecate @r5v/mongoose-paginate@X.Y.Z "use X.Y.Z+1"`.
- Optional: `git tag vX.Y.Z && git push --tags` after publishing. There are no tags in the repository yet.

## Changelog

### 1.0.18
  - **Fixed `exec()` return type** - `PagingQuery.exec()` and `AggregationPagingQuery.exec()` return `Promise<any>` again. 1.0.14 through 1.0.17 narrowed it to `Promise<unknown>`, which stopped consumers that use the result (for example `res.send(await query.exec())` typed against a response body) from compiling. Runtime behaviour is unchanged.

### 1.0.17
  - **Moved mongoose to peerDependencies** - Reduces bundle size for consumers who already have mongoose installed
  - Supports mongoose >= 8.0.0 (tested with 8.16.0 and 9.1.4)

### 1.0.15
  - **Re-enabled `removeProtected` option** for `AggregationPagingQuery` (EXPERIMENTAL) - Automatically excludes fields marked with `select: false` in your schema (e.g., passwords, secret keys) from aggregation results. Use with caution and test thoroughly in your environment.
  - Uses refactored `findProtectedPaths` utility which safely traverses schemas without JSON serialization

### 1.0.14
  - Added proper TypeScript package exports with subpaths (`/utils`, `/types`)
  - Exported all utility functions (dot notation, sort parsing, validation)
  - Exported all TypeScript types
  - **Fixed Express Request type compatibility** - Added `RequestLike` interface to allow custom request types without index signature issues
  - Fixed JSON.parse crash on malformed `$filter`/`$postFilter` parameters
  - Fixed regex global flag bug in populate parsing
  - Added input validation to constructors
  - Improved type safety (reduced `any` usage)
  - Removed deprecated `$includes` parameter
  - Replaced `JSON.parse(JSON.stringify())` with `structuredClone()`
  - Fixed inconsistent equality operator (`==` to `===`)
  - **Fixed empty pipeline crash** - `AggregationPagingQuery.initQuery` no longer crashes when pipeline is empty
  - **Refactored `buildPopulate`** - Extracted inner functions to module level for better testability
  - **Refactored `findProtectedPaths`** - Removed JSON.stringify that could fail on circular references
  - **Refactored `getPathsWithRef`** - Simplified input handling, removed brittle string parsing
  - **Added `schemaTraversal` utility** - Shared `buildFullPath` and `traverseSchemaObject` functions for schema traversal

### 1.0.13
  - Fix issue where disablePaging was not working on aggregation query

### 1.0.12
  - Fix issue with AggregationPagingQuery where static post filter would not be applied if $postFilter param was not supplied
  - updated typings on AggregationPagingQuery to include enablePostFilter, enableFilter, and enablePreSort
  - flipped PagingQuery back to `disableFilter` instead of `enableFilter` option \# this was set incorrectly in 1.0.11 but still defaults to false

### 1.0.11
Fix Issue with Typescript build

### 1.0.9
Fix Issue with Typescript add buildPopulate Export

### 1.0.8
Adds Deep Populate and Select Notation

