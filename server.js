import express from 'express';
import dotenv from 'dotenv/config';
import { Connection } from './config/dbConnection.js';
import route from './routes/userRoutes.js';
const app = express();


Connection();
app.use(express.json())
app.use("/user",route)


app.listen(process.env.PORT , ()=>{
    console.log("server is running on" , process.env.PORT)
})