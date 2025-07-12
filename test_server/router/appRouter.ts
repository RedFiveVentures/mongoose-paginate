import express from "express";
import {PagingQuery} from "../../src/pagingQuery";
import {Author, Book, Publisher} from "../services/mongodb/schemas";
import {AggregationPagingQuery} from "../../src/index";


export const appRouter = express.Router();

appRouter.get("/paging/books",async (req,res)=>{
    const query = new PagingQuery(req, Author , {})
    const results = await query.exec()
    res.send(results)
});
appRouter.get("/paging/publishers",async (req,res)=>{
    const query = new PagingQuery(req, Publisher , {})
    const results = await query.exec()
    res.send(results)
});
appRouter.get("/paging/authors",async (req,res)=>{
    const query = new PagingQuery(req, Book , {})
    const results = await query.exec()
    res.send(results)
});

appRouter.get("/aggregate/books",async (req,res)=>{
    const query = new AggregationPagingQuery(req, Book , {
        pipeline: [
            {$match: {pages: {$gte:300}}}
        ]
    })
    const results = await query.exec()
    res.send(results)
});
appRouter.get("/aggregate/publishers",async (req,res)=>{
    const query = new AggregationPagingQuery(req, Publisher , {
        pipeline: [
            {$match: {isActive: true}}
        ]
    })
    const results = await query.exec()
    res.send(results)
});
appRouter.get("/aggregate/authors",async (req,res)=>{
    const query = new AggregationPagingQuery(req, Author , {
        pipeline: [
            {$match: {nationality : "British"}}
        ],
    })
    console.log(JSON.stringify(query.query))
    const results = await query.exec()
    res.send(results)
});