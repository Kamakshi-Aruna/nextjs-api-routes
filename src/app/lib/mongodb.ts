import mongoose from "mongoose";

const connectMongo = async (): Promise<void> => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
};

export default connectMongo;