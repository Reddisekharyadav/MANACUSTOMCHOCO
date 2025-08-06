const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/manacustomchoco';

async function resetWrappers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Clear existing wrappers
    console.log('Clearing existing wrappers...');
    await db.collection('wrappers').deleteMany({});
    
    // Insert new wrappers
    console.log('Adding new wrapper collection...');
    const wrappers = [
      {
        name: "Elegant Rose Garden",
        description: "A sophisticated floral design featuring delicate roses in soft pink and gold tones",
        price: 25,
        imageUrl: "/uploads/model-mc001.jpg",
        modelNumber: "MC001",
        tags: ["floral", "elegant", "pink", "gold"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Golden Celebration",
        description: "Luxurious golden wrapper with sparkling accents perfect for special occasions",
        price: 30,
        imageUrl: "/uploads/model-mc002.jpg",
        modelNumber: "MC002",
        tags: ["golden", "luxury", "celebration", "sparkling"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Royal Blue Elegance",
        description: "Majestic blue design with silver highlights and royal patterns",
        price: 28,
        imageUrl: "/uploads/model-mc003.jpg",
        modelNumber: "MC003",
        tags: ["blue", "royal", "elegant", "silver"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Vintage Charm",
        description: "Classic vintage-inspired design with antique flourishes and warm earth tones",
        price: 26,
        imageUrl: "/uploads/model-mc004.jpg",
        modelNumber: "MC004",
        tags: ["vintage", "classic", "antique", "earth"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Modern Minimalist",
        description: "Clean, contemporary design with geometric patterns and neutral colors",
        price: 24,
        imageUrl: "/uploads/model-mc005.jpg",
        modelNumber: "MC005",
        tags: ["modern", "minimalist", "geometric", "neutral"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Tropical Paradise",
        description: "Vibrant tropical design featuring palm leaves and exotic flowers",
        price: 27,
        imageUrl: "/uploads/model-mc006.jpg",
        modelNumber: "MC006",
        tags: ["tropical", "vibrant", "palm", "exotic"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Midnight Mystery",
        description: "Dark and sophisticated design with starry patterns and deep purple accents",
        price: 29,
        imageUrl: "/uploads/model-mc007.jpg",
        modelNumber: "MC007",
        tags: ["dark", "mystery", "stars", "purple"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Sweet Spring",
        description: "Fresh spring design with pastel colors and blooming flower motifs",
        price: 25,
        imageUrl: "/uploads/model-mc008.jpg",
        modelNumber: "MC008",
        tags: ["spring", "pastel", "flowers", "fresh"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Autumn Harvest",
        description: "Warm autumn-themed wrapper with golden leaves and harvest elements",
        price: 26,
        imageUrl: "/uploads/model-mc009.jpg",
        modelNumber: "MC009",
        tags: ["autumn", "harvest", "leaves", "warm"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Crystal Shimmer",
        description: "Sparkling crystal-inspired design with holographic effects and silver details",
        price: 32,
        imageUrl: "/uploads/model-mc010.jpg",
        modelNumber: "MC010",
        tags: ["crystal", "shimmer", "holographic", "silver"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Heritage Classic",
        description: "Traditional design with heritage patterns and rich burgundy colors",
        price: 27,
        imageUrl: "/uploads/model-mc011.jpg",
        modelNumber: "MC011",
        tags: ["heritage", "traditional", "burgundy", "classic"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Ocean Breeze",
        description: "Refreshing ocean-themed design with wave patterns and aqua blue tones",
        price: 25,
        imageUrl: "/uploads/model-mc012.jpg",
        modelNumber: "MC012",
        tags: ["ocean", "waves", "aqua", "refreshing"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Enchanted Forest",
        description: "Mystical forest design with woodland creatures and emerald green accents",
        price: 28,
        imageUrl: "/uploads/model-mc013.jpg",
        modelNumber: "MC013",
        tags: ["forest", "woodland", "emerald", "mystical"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Sunset Serenade",
        description: "Beautiful sunset-inspired wrapper with gradient orange and pink hues",
        price: 26,
        imageUrl: "/uploads/model-mc014.jpg",
        modelNumber: "MC014",
        tags: ["sunset", "gradient", "orange", "pink"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Diamond Luxury",
        description: "Premium diamond-pattern design with platinum accents and crystal elements",
        price: 35,
        imageUrl: "/uploads/model-mc015.jpg",
        modelNumber: "MC015",
        tags: ["diamond", "luxury", "platinum", "crystal"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Bohemian Dreams",
        description: "Free-spirited bohemian design with mandala patterns and earth tones",
        price: 24,
        imageUrl: "/uploads/model-mc016.jpg",
        modelNumber: "MC016",
        tags: ["bohemian", "mandala", "earth", "free-spirit"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Arctic Frost",
        description: "Cool winter design with frost patterns and icy blue crystalline effects",
        price: 27,
        imageUrl: "/uploads/model-mc017.jpg",
        modelNumber: "MC017",
        tags: ["arctic", "frost", "winter", "crystalline"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Carnival Celebration",
        description: "Festive carnival design with vibrant colors and playful confetti patterns",
        price: 26,
        imageUrl: "/uploads/model-mc018.jpg",
        modelNumber: "MC018",
        tags: ["carnival", "festive", "vibrant", "confetti"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Zen Garden",
        description: "Peaceful zen-inspired design with bamboo elements and sage green tones",
        price: 25,
        imageUrl: "/uploads/model-mc019.jpg",
        modelNumber: "MC019",
        tags: ["zen", "bamboo", "peaceful", "sage"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Copper Glow",
        description: "Warm copper metallic design with burnished effects and bronze highlights",
        price: 29,
        imageUrl: "/uploads/model-mc020.jpg",
        modelNumber: "MC020",
        tags: ["copper", "metallic", "bronze", "warm"],
        isActive: true,
        createdAt: new Date()
      },
      {
        name: "Starry Night",
        description: "Magical night sky design with twinkling stars and deep navy background",
        price: 28,
        imageUrl: "/uploads/model-mc021.jpg",
        modelNumber: "MC021",
        tags: ["stars", "night", "navy", "magical"],
        isActive: true,
        createdAt: new Date()
      }
    ];

    await db.collection('wrappers').insertMany(wrappers);
    console.log(`Added ${wrappers.length} new wrappers to the database`);
    
  } catch (error) {
    console.error('Error resetting wrappers:', error);
  } finally {
    await client.close();
  }
}

resetWrappers();
