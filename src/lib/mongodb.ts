import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Connection options - simplified for reliability
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority' as const,
  // Only use TLS for Atlas connections
  ...(uri.includes('mongodb+srv') ? {
    tls: true,
    tlsAllowInvalidCertificates: false,
  } : {})
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

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
  // In production, use static database for reliability
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Using static database for production');
    const { createStaticDatabase } = await import('./staticDatabase');
    const { client, db } = createStaticDatabase();
    return { client: (client as unknown) as MongoClient, db: (db as unknown) as Db };
  }
  
  // In development, try MongoDB first, then fallback to static
  try {
    const client = await clientPromise;
    const db = client.db('manacustomchoco');
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ Connected to MongoDB successfully');
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('🔄 Falling back to static database');
    
    const { createStaticDatabase } = await import('./staticDatabase');
    const { client, db } = createStaticDatabase();
    return { client: (client as unknown) as MongoClient, db: (db as unknown) as Db };
  }
}

const exportedClientPromise = clientPromise;
export default exportedClientPromise;
