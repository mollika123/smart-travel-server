import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI!;
        console.log("Mongo URI:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    console.log("Database name:", mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
