import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Already connected to MongoDB');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    }).catch(err => {
      console.error('Error connecting to MongoDB:', err);
      throw new Error('MongoDB connection failed');
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
