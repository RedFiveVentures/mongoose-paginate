

@r5v/mongoose-pagination is a powerful yet lightweight utility that bridges the gap between HTTP query parameters and MongoDB queries. It provides an intuitive wrapper around Mongoose models, allowing you to easily transform Express request objects into sophisticated database queries with pagination, filtering, and sorting capabilities.

Simple, Fast, Efficient

This project was designed to accomodate more than 80% of your daily workflow to remove the overhead of boilerplate code in handling each endpoint and keeping queries and query params simple. We didn't want you to have to learn a new language to use this product

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
| $populate   | comma separated dot notation string \n books,publishers                           | using refs and virtuals, a dot notation string will populate the model using .populate                                                                                                                         | PagingQuery                         |
| $select     | comma separated dot notation string \n books,-_id \| -_id,-name,address.-address1 | using the select notation uses the mongoose name \| -name syntax to filter the output. use this in conjunction with the $populate query to filter keys \n ie books.title,books.publisher \| -name,books.-title | PagingQuery, AggregationPagingQuery |   
| $lean       | no value needed, this will return a lean query result                             | returns a lean result. does not require a value                                                                                                                                                                | PagingQuery                         |   
| $sort       | space separated mongoose sort string \n name -value                               | inserts sort into the query. In aggregation queries this will insert a sort after the existing pipeline                                                                                                        | PagingQuery, AggregationPagingQuery | 
| $preSort    | comma separated dot notation string \n books,-_id \| -_id,-name,address.-address1 | in aggregate queries this will insert a sort object after the initial match in the pipeline.                                                                                                                   | AggregationPagingQuery              |
| $count      | comma separated dot notation string                                               | this comma separate string will traverse the results and insert a new field  with the $size of the selected key/value . this new name field will be appended with `_count`                                     | AggregationPagingQuery              |   
| $postFilter | Any Json Object                                                                   | creates and additional filter and in aggregation queries is appended to the end of the pipeline                                                                                                                | AggregationPagingQuery              |   

#### Options

| Key                         | Value                | Description                                                                                                                                                              | Class Availability                  | Required | Default |
|:----------------------------|:---------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------|:---------|:--------|
| disablePaging               | boolean              | disables paging and $paging param use                                                                                                                                    | PagingQuery, AggregationPagingQuery |          | false   |
| enableFilter                | boolean              | disables the $filter param on req.                                                                                                                                       | PagingQuery, AggregationPagingQuery |          | false   |
| single                      | boolean              | disables paging on the query. converts from .find query to .findOne()                                                                                                    | PagingQuery, AggregationPagingQuery |          | true    |
| enablePostFilter            | boolean              | disables the ability to create a dynamic filter per request                                                                                                              | AggregationPagingQuery              |          | false   |
| staticPostFilter            | Mongo Filter Object  | create a filter on the pipeline that is added after all the pipeline stages. this cannot be overwritten by params                                                        | AggregationPagingQuery              |          | {}      |
| staticFilter                | Mongo Filter Object  | create a filter on the pipeline that is added before all the pipeline stages. on find requests, this is added to the filter object. this cannot be overwritten by params | AggregationPagingQuery              |          | {}      |
| pipeline                    | MongoPipelineStage[] | pipeline request object. if the first item in pipeline stage is a $match or another required first stage operator. it will be placed before all other modifiers          | AggregationPagingQuery              | true     | []      |
| removeProtected \(REMOVED\) | boolean              | auto remove protected (select: false) for root Model                                                                                                                     | AggregationPagingQuery              |          | false   |

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

1. staticFilter \| \$filter \| $match (if first item in pipeline)
2. \$preSort
3. apply pipeline
4. \$select \| project
5. remove protected fields
6. \$count
7. \$sort
8. apply options


## NOTES
1. removeProtected removed from aggregation query due to inconsistent results after publication