
import mongoose from   "mongoose";
import {booksData} from "./src/tests/models/testData";
import {Book} from "./src/tests/models/books";
const mongoSetup = require('@shelf/jest-mongodb/lib/setup');



module.exports = async () => {
   // await mongoSetup({rootDir:".", useSharedDBForAllJestWorkers: true})



};