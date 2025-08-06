const { MongoClient } = require('mongodb');

const localUri = "mongodb://localhost:27017/manacustomchoco";
const atlasUri = "mongodb+srv://reddisekharmarugani:d02WcIn5gjA6kRnK@mango.inf19hb.mongodb.net/manacustomchoco";

async function transferData() {
  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);
  
  try {
    // Connect to both databases
    await localClient.connect();
    await atlasClient.connect();
    console.log("✅ Connected to both databases");
    
    const localDb = localClient.db('manacustomchoco');
    const atlasDb = atlasClient.db('manacustomchoco');
    
    // Transfer wrappers
    console.log("📦 Transferring wrappers...");
    const wrappers = await localDb.collection('wrappers').find({}).toArray();
    
    if (wrappers.length > 0) {
      // Clear existing data in Atlas (if any)
      await atlasDb.collection('wrappers').deleteMany({});
      
      // Insert all wrappers
      await atlasDb.collection('wrappers').insertMany(wrappers);
      console.log(`✅ Transferred ${wrappers.length} wrappers`);
    }
    
    // Transfer admins
    console.log("👤 Transferring admins...");
    const admins = await localDb.collection('admins').find({}).toArray();
    
    if (admins.length > 0) {
      await atlasDb.collection('admins').deleteMany({});
      await atlasDb.collection('admins').insertMany(admins);
      console.log(`✅ Transferred ${admins.length} admins`);
    }
    
    console.log("\n🎉 Data transfer completed successfully!");
    console.log("Your Vercel app should now show all wrappers!");
    
  } catch (error) {
    console.error("❌ Transfer failed:", error);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

transferData();
