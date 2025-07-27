import mongoose, { connect } from "mongoose";

mongoose.set("debug", function (collection, method, query, document) {
  // console.log("MONGO DB QUERY", collection, method, query, document);
});

declare global {
  var client: {
    promise: ReturnType<typeof connect> | null;
    connection: typeof mongoose | null;
  };
}

let cached = global.client;

if (!cached) {
  cached = global.client = { connection: null, promise: null };
}

export async function dbConnect() {
  if (cached.connection && cached.connection.connection.readyState === 1) {
    return cached.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
      serverSelectionTimeoutMS: 60000, // 60 seconds
      socketTimeoutMS: 60000, // 60 seconds
      connectTimeoutMS: 60000, // 60 seconds
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority' as const,
      // Additional options for better connection stability
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = connect(process.env.MONGODB_URI, options)
      .then((client) => {
        console.log('MongoDB connected successfully');
        
        // Set up connection event listeners
        client.connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        
        client.connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
          cached.connection = null;
          cached.promise = null;
        });
        
        return client;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}
