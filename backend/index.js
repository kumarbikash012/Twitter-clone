// import express  from "express";
// import dotenv from "dotenv"
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import cors from 'cors'
// // const cors = require('cors');


// import userRoutes from "./routes/user.js"
// import authRoutes from "./routes/auths.js";
// import tweetRoutes from "./routes/tweets.js"

// const app = express();
// dotenv.config();

// app.use(cors());

// const connect = ()=>{
//     // mongoose.set ("strictQuery", false);
//     mongoose.connect(process.env.MONGO)
//     .then(()=>{
//         console.log("Database connection established");
//     })
//     .catch((err)=> {
//         throw err;
//     })
// };

// app.use(cookieParser());
// app.use(express.json())
// app.use("/api/users",userRoutes)
// app.use("/api/auth",authRoutes)
// app.use("/api/tweets",tweetRoutes)


// app.listen(8000,()=>{
//     connect();
//     console.log('Listening to port');
// })


import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { GridFSBucket } from 'mongodb'; // Import GridFSBucket

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Database connection established");
        
        // Create GridFSBucket instance after MongoDB connection is established
        const bucket = new GridFSBucket(mongoose.connection.db);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if connection fails
    }
};

app.listen(8000, async () => {
    await connect(); // Call connect function to establish database connection
    console.log('Listening on port 8000');
});


