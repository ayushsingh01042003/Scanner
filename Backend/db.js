import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();
const mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL)
const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("MongoDB connected")
})

db.on('error', (err)=>{
    console.log(err)
})

db.on('disconnected', ()=>{
    console.log("Disconnected to MongoDB")
})

export default db;
