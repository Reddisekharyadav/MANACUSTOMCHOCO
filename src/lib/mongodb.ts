import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Optimized options for MongoDB Atlas cloud connection
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority' as const,
  // Enhanced options for cloud connectivity
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  maxIdleTimeMS: 30000,
  // SSL options to handle connection issues
  tls: true,
  tlsInsecure: false,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise;
    const db = client.db('manacustomchoco');
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB Atlas');
  }
}

export default clientPromise;
