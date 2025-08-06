// Simple script to populate MongoDB Atlas with sample wrappers
import { MongoClient } from 'mongodb';

const atlasUri = "mongodb+srv://reddisekharmarugani:d02WcIn5gjA6kRnK@mango.inf19hb.mongodb.net/manacustomchoco?retryWrites=true&w=majority";

const sampleWrappers = [
  {
    modelNumber: "MC001",
    name: "Elegant Rose Garden",
    description: "Beautiful rose-themed wrapper perfect for romantic occasions and special celebrations",
    price: 299,
    imageUrl: "/uploads/model-mc001.jpg",
    likes: 15,
    likedBy: [],
    isLateNightSpecial: true,
    lateNightPrice: 249,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    modelNumber: "MC002",
    name: "Golden Celebration",
    description: "Luxurious golden design ideal for weddings and premium celebrations",
    price: 349,
    imageUrl: "/uploads/model-mc002.jpg",
    likes: 23,
    likedBy: [],
    isLateNightSpecial: false,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    modelNumber: "MC003",
    name: "Royal Blue Elegance",
    description: "Sophisticated blue wrapper with elegant patterns for distinguished events",
    price: 329,
    imageUrl: "/uploads/model-mc003.jpg",
    likes: 31,
    likedBy: [],
    isLateNightSpecial: true,
    lateNightPrice: 279,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    modelNumber: "MC004",
    name: "Vintage Charm",
    description: "Classic vintage-inspired design with timeless appeal and nostalgic elements",
    price: 359,
    imageUrl: "/uploads/model-mc004.jpg",
    likes: 27,
    likedBy: [],
    isLateNightSpecial: true,
    lateNightPrice: 309,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    modelNumber: "MC005",
    name: "Modern Minimalist",
    description: "Clean, minimalist design perfect for contemporary celebrations and modern aesthetics",
    price: 279,
    imageUrl: "/uploads/model-mc005.jpg",
    likes: 19,
    likedBy: [],
    isLateNightSpecial: false,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleAdmin = {
  username: "admin",
  password: "$2b$10$rQ.Z9N5QJYJ5yQ1QJYJ5yOe", // This should be hashed password for "ManaChoco2025!"
  createdAt: new Date()
};

async function seedAtlasDatabase() {
  const client = new MongoClient(atlasUri);
  
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected successfully!");
    
    const db = client.db('manacustomchoco');
    
    // Insert wrappers
    console.log("📦 Inserting wrappers...");
    await db.collection('wrappers').deleteMany({}); // Clear existing
    const wrappersResult = await db.collection('wrappers').insertMany(sampleWrappers);
    console.log(`✅ Inserted ${wrappersResult.insertedCount} wrappers`);
    
    // Insert admin
    console.log("👤 Setting up admin...");
    await db.collection('admins').deleteMany({}); // Clear existing
    const adminResult = await db.collection('admins').insertOne(sampleAdmin);
    console.log("✅ Admin user created");
    
    console.log("\n🎉 Database seeded successfully!");
    console.log("🌐 Your site should now show wrappers: https://manacustomchoco.vercel.app/");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

seedAtlasDatabase();
