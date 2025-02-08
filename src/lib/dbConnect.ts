import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Database Already Connected")
        return;
    }
    try {
        const db = await mongoose.connect(process.env.NEXT_MONGODB_URI!)
        connection.isConnected = db.connections[0].readyState
        console.log("Database Connected")
    } catch (error) {
        console.log("Database Connection Failed", error)
        process.exit(1);
    }
}
export default dbConnect;