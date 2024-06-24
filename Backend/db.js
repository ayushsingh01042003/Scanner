import mongoose from "mongoose";

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URI}`);
        console.log(`Connected to DB`);
    } catch(err) {
        console.log(`Error connecting to DB ${err}`);
    }
}

export default connectToMongoDB;