import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("sample") || uri === "") {
    // MongoDB URI not set; fallback to resilient mock/in-memory store
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        return m;
      })
      .catch((err) => {
        console.warn("[MongoDB] Connection could not be established; falling back to in-memory store:", err.message);
        cached.promise = null;
        return null as unknown as typeof mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn) {
      // Trigger initial seeding if database is empty
      import("@/lib/seed").then(({ seedInitialDataIfEmpty }) => {
        seedInitialDataIfEmpty().catch((err) =>
          console.warn("[MongoDB] Auto-seeding encountered issue:", err)
        );
      });
    }
    return cached.conn;
  } catch {
    cached.conn = null;
    return null;
  }
}
