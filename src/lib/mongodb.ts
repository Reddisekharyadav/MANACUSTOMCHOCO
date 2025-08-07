import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Different options for development vs production
const getConnectionOptions = (): MongoClientOptions => {
  const baseOptions: MongoClientOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority' as const,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    maxIdleTimeMS: 30000,
  };

  // For local development, try to work around SSL issues
  if (process.env.NODE_ENV === 'development') {
    return {
      ...baseOptions,
      // Disable strict SSL for development only
      tls: true,
      tlsInsecure: true, // Allow self-signed certificates in dev
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 3000, // Shorter timeout for faster failure
    };
  }

  // Production settings - strict SSL
  return {
    ...baseOptions,
    tls: true,
    tlsInsecure: false,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  };
};

const options = getConnectionOptions();

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
    
    // In development, provide helpful fallback suggestions
    if (process.env.NODE_ENV === 'development') {
      console.log('💡 Development Fallback Options:');
      console.log('1. Check if MongoDB Atlas IP whitelist includes 0.0.0.0/0');
      console.log('2. Try using local MongoDB: mongodb://localhost:27017/manacustomchoco');
      console.log('3. Use production deployment at https://manacustomchoco.vercel.app');
      
      // Return mock data for development if needed
      if (process.env.USE_MOCK_DATA === 'true') {
        console.log('🔄 Using mock data for development...');
        return createMockDatabase();
      }
    }
    
    throw new Error('Failed to connect to MongoDB Atlas');
  }
}

// Mock database for development fallback
function createMockDatabase(): { client: any; db: any } {
  const mockData = {
    wrappers: [
      {
        _id: '507f1f77bcf86cd799439011',
        modelNumber: 'MC001',
        name: 'Elegant Rose Garden',
        description: 'Beautiful rose-themed wrapper perfect for romantic occasions',
        price: 299,
        isLateNightSpecial: true,
        lateNightPrice: 249,
        imageUrl: 'https://images.unsplash.com/photo-1518707681017-e820adf2ca1d?w=800&q=80',
        likes: 15,
        likedBy: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    admins: [
      {
        _id: '507f1f77bcf86cd799439012',
        username: 'admin',
        password: '$2b$12$8mK8W8BVRMdQY8W8BVRMdQaKsGKqxT7T7T7T7T7T7T7T7T7T7T7T7T7',
        createdAt: new Date()
      }
    ]
  };

  const mockDb = {
    collection: (name: string) => ({
      find: () => ({
        sort: () => ({
          toArray: async () => mockData[name as keyof typeof mockData] || []
        }),
        toArray: async () => mockData[name as keyof typeof mockData] || []
      }),
      findOne: async () => mockData[name as keyof typeof mockData]?.[0] || null,
      insertOne: async (doc: any) => ({ insertedId: '507f1f77bcf86cd799439013' }),
      insertMany: async (docs: any[]) => ({ insertedIds: docs.map((_, i) => `507f1f77bcf86cd799439${14 + i}`) }),
      updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 1 }),
      countDocuments: async () => mockData[name as keyof typeof mockData]?.length || 0
    }),
    admin: () => ({
      ping: async () => true
    })
  };

  return { client: null, db: mockDb as any };
}

export default clientPromise;
