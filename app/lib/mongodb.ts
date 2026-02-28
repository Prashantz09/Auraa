import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_URI"\n' +
      "Add MONGODB_URI to your .env.local file.\n" +
      "Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/auraa",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // Already connected — reuse
  if (cached.conn) {
    console.log("[MongoDB] Reusing existing connection ✓");
    return cached.conn;
  }

  // Connection in progress — wait for it
  if (!cached.promise) {
    console.log("[MongoDB] Creating new connection...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
      })
      .then((m) => {
        console.log("[MongoDB] Connected ✓ to:", m.connection.name);
        return m;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection FAILED:", err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
