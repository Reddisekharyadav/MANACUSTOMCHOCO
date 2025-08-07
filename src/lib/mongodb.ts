import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Connection options optimized for MongoDB Atlas
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 0,
  connectTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority' as const,
  // SSL configuration for Atlas
  tls: true,
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
    
    // For now, always try to connect - no fallback
    throw new Error('Failed to connect to MongoDB Atlas');
  }
}

// Mock database for development fallback
function createMockDatabase(): { client: unknown; db: unknown } {
  const mockData = {
    wrappers: [
      {
        _id: '507f1f77bcf86cd799439011',
        modelNumber: 'MC001',
        name: 'Elegant Rose Garden',
        description: 'Beautiful rose-themed wrapper perfect for romantic occasions and celebrations',
        price: 299,
        isLateNightSpecial: true,
        lateNightPrice: 249,
        imageUrl: 'https://images.unsplash.com/photo-1518707681017-e820adf2ca1d?w=800&q=80',
        likes: 15,
        likedBy: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '507f1f77bcf86cd799439012',
        modelNumber: 'MC002',
        name: 'Golden Celebration',
        description: 'Luxurious golden design ideal for weddings and premium celebrations',
        price: 349,
        isLateNightSpecial: false,
        lateNightPrice: 349,
        imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80',
        likes: 23,
        likedBy: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '507f1f77bcf86cd799439013',
        modelNumber: 'MC003',
        name: 'Royal Blue Elegance',
        description: 'Sophisticated blue wrapper with elegant patterns for distinguished events',
        price: 329,
        isLateNightSpecial: true,
        lateNightPrice: 279,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
        likes: 18,
        likedBy: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    admins: [
      {
        _id: '507f1f77bcf86cd799439014',
        username: 'admin',
        password: '$2b$12$8mK8W8BVRMdQY8W8BVRMdQaKsGKqxT7T7T7T7T7T7T7T7T7T7T7T7T7',
        createdAt: new Date()
      }
    ]
  };

  const mockCollection = (name: string) => ({
    find: () => ({
      sort: () => ({
        toArray: async () => mockData[name as keyof typeof mockData] || []
      }),
      toArray: async () => mockData[name as keyof typeof mockData] || []
    }),
    findOne: async () => mockData[name as keyof typeof mockData]?.[0] || null,
    insertOne: async (_doc: unknown) => ({ insertedId: '507f1f77bcf86cd799439015' }),
    insertMany: async (docs: unknown[]) => ({ insertedIds: docs.map((_, i) => `507f1f77bcf86cd799439${16 + i}`) }),
    updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
    deleteOne: async () => ({ deletedCount: 1 }),
    countDocuments: async () => mockData[name as keyof typeof mockData]?.length || 0
  });

  const mockDb = {
    collection: mockCollection,
    admin: () => ({
      ping: async () => true
    })
  };

  return { client: null, db: mockDb };
}

export default clientPromise;
