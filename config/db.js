import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

let isConnecting = false;

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ Error: MONGO_URI is not set");
        return false;
    }

    if (isDatabaseConnected() || isConnecting) {
        return isDatabaseConnected();
    }

    isConnecting = true;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDb Connected✅");
        return true;
    } catch (error) {
        console.error(`❌ Mongo connection error: ${error.message}`);
        return false;
    } finally {
        isConnecting = false;
    }
};

export const startDbReconnectLoop = (intervalMs = 10000) => {
    setInterval(async () => {
        if (!isDatabaseConnected()) {
            await connectDB();
        }
    }, intervalMs);
};

export default connectDB;