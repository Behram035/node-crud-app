import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
const Database = async () =>{
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`Mongodb is Connected : ${dbConnection.connection.host}`)
    } catch (error) {
        console.log("Mongodb Connection failed"); 
        process.exit(1) 
    } 
}
export {Database} 