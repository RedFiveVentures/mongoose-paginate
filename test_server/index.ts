import express, {ErrorRequestHandler, RequestHandler} from "express";
import {ErrorHandler} from "./utils/errorRequestHandler";
import dotenv from 'dotenv'
import {mongooseClient} from "./services/mongodb/mongo";
import {appRouter} from "./router/appRouter";




dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));

app.use(appRouter)

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