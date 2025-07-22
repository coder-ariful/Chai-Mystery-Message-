import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection : ConnectionObject = {};

export default async function DBconnect(): Promise<void> {
    // if database already connected then run this.
    if(connection.isConnected) {
        console.log("Already connected  to database.");
        return
    }
    // if database not connected then run this
    try {
        // first connect to database user await
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log(db);
        // connection give us an array.
        connection.isConnected = db.connections[0].readyState

        console.log("connection is: ", connection);
        console.log("connection.isConnected is: ", connection.isConnected);

        console.log("DB connected successfully .");
    } catch (error) {
        console.log("MongoDB connection is Failed.");
        console.log('Error : ' , error);
        process.exit(1)
    }

}