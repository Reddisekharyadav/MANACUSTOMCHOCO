// Import data to MongoDB Atlas
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Your Atlas connection string (replace with actual values)
const atlasUri = "mongodb+srv://reddisekharmarugani:d02WcIn5gjA6kRnK@mango.inf19hb.mongodb.net/manacustomchoco?retryWrites=true&w=majority";

async function importData() {
  const client = new MongoClient(atlasUri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    retryWrites: true,
    w: 'majority'
  });
  
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    
    const db = client.db('manacustomchoco');
    
    // Import wrappers
    console.log("📦 Importing wrappers...");
    const wrappers = JSON.parse(fs.readFileSync('./wrappers-export.json', 'utf8'));
    if (wrappers.length > 0) {
      await db.collection('wrappers').insertMany(wrappers);
      console.log(`✅ Imported ${wrappers.length} wrappers`);
    }
    
    // Import admins
    console.log("👥 Importing admins...");
    const admins = JSON.parse(fs.readFileSync('./admins-export.json', 'utf8'));
    if (admins.length > 0) {
      await db.collection('admins').insertMany(admins);
      console.log(`✅ Imported ${admins.length} admins`);
    }
    
    console.log("🎉 Data import completed successfully!");
    
    // Verify import
    const wrapperCount = await db.collection('wrappers').countDocuments();
    const adminCount = await db.collection('admins').countDocuments();
    console.log(`📊 Verification: ${wrapperCount} wrappers, ${adminCount} admins`);
    
  } catch (error) {
    console.error("❌ Import failed:", error);
  } finally {
    await client.close();
  }
}

importData();
