import express, {ErrorRequestHandler, RequestHandler} from "express";
import {ErrorHandler} from "./utils/errorRequestHandler";
import dotenv from 'dotenv'
import {mongooseClient} from "./services/mongodb/mongo";
import {Author, Book, Publisher} from "./services/mongodb/schemas";
import {PagingQuery} from "../../src"
import {AggregationPagingQuery} from "../../src/aggregationPagingQuery";

dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));

app.get("/authors", async (req, res, next)=>{
    try {
        const query = new PagingQuery(req, Author,{
            staticFilter:{"isActive":true}
            //single: true
        })

        const authors = await query.exec()
        res.send(authors)
    } catch(err) {
        return next(err)
    }
})
app.get("/books",async (req, res)=>{
    const query = new PagingQuery(req, Book, {})
    const books = await query.exec()
    res.send(books)
})
app.get("/publishers",async (req, res)=>{
    const query =   new AggregationPagingQuery(req, Publisher,{
        pipeline: [
            {$match: {isActive: true}}
        ],
        allowDiskUse: false,
        disableFilter: false,
        disablePostFilter: false
    } )
    const results = await query.exec()

    res.send(results)
})

const initDatabase = async()=>{
    try {
        await mongooseClient.connect({
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore',
            options: {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
            }
        });
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}


const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
    try {
       console.info(`App listening on port: ${port}`)
        initDatabase()
    } catch (err) {
        console.error(err)
    }
})


//app.use(ErrorHandler)