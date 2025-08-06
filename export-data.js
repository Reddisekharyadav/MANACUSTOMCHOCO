const { MongoClient } = require('mongodb');
const fs = require('fs');

// Your current local MongoDB
const localUri = "mongodb://localhost:27017/manacustomchoco";

async function exportData() {
  const client = new MongoClient(localUri);
  
  try {
    await client.connect();
    console.log("🔗 Connected to local MongoDB");
    
    const db = client.db('manacustomchoco');
    
    // Export wrappers
    const wrappers = await db.collection('wrappers').find({}).toArray();
    fs.writeFileSync('./wrappers-export.json', JSON.stringify(wrappers, null, 2));
    console.log(`✅ Exported ${wrappers.length} wrappers to wrappers-export.json`);
    
    // Export admins
    const admins = await db.collection('admins').find({}).toArray();
    fs.writeFileSync('./admins-export.json', JSON.stringify(admins, null, 2));
    console.log(`✅ Exported ${admins.length} admins to admins-export.json`);
    
    console.log("\n📦 Data exported successfully!");
    console.log("You can now import this data to MongoDB Atlas");
    
  } catch (error) {
    console.error("❌ Export failed:", error);
  } finally {
    await client.close();
  }
}

exportData();
