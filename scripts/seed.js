const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/manacustomchoco';

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('manacustomchoco');
    
    // Create admin user
    const adminCollection = db.collection('admins');
    const existingAdmin = await adminCollection.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await adminCollection.insertOne({
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create sample wrappers
    const wrappersCollection = db.collection('wrappers');
    const existingWrappers = await wrappersCollection.countDocuments();
    
    if (existingWrappers === 0) {
      const sampleWrappers = [
        {
          modelNumber: 'MC001',
          name: 'Elegant Rose Garden',
          description: 'Beautiful rose-themed wrapper perfect for romantic occasions and special celebrations',
          price: 299,
          imageUrl: '/uploads/model-mc001.jpg',
          likes: 15,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 249,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC002',
          name: 'Golden Celebration',
          description: 'Luxurious golden design ideal for weddings and premium celebrations',
          price: 349,
          imageUrl: '/uploads/model-mc002.jpg',
          likes: 23,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC003',
          name: 'Royal Blue Elegance',
          description: 'Sophisticated blue wrapper with elegant patterns for distinguished events',
          price: 329,
          imageUrl: '/uploads/model-mc003.jpg',
          likes: 31,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 279,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC004',
          name: 'Floral Paradise',
          description: 'Vibrant floral design perfect for spring celebrations and garden parties',
          price: 299,
          imageUrl: '/uploads/model-mc004.jpg',
          likes: 18,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC005',
          name: 'Vintage Charm',
          description: 'Classic vintage-inspired design with timeless appeal and nostalgic elements',
          price: 359,
          imageUrl: '/uploads/model-mc005.jpg',
          likes: 27,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 309,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC006',
          name: 'Modern Geometric',
          description: 'Contemporary geometric patterns for modern celebrations and stylish events',
          price: 319,
          imageUrl: '/uploads/model-mc006.jpg',
          likes: 12,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC007',
          name: 'Festive Sparkle',
          description: 'Glittery and festive design perfect for celebrations and joyful occasions',
          price: 389,
          imageUrl: '/uploads/model-mc007.jpg',
          likes: 21,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 339,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC008',
          name: 'Pastel Dreams',
          description: 'Soft pastel colors ideal for baby showers and gentle celebrations',
          price: 279,
          imageUrl: '/uploads/model-mc008.jpg',
          likes: 19,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC009',
          name: 'Butterfly Garden',
          description: 'Delicate butterfly motifs perfect for nature lovers and spring events',
          price: 339,
          imageUrl: '/uploads/model-mc009.jpg',
          likes: 25,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 289,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC010',
          name: 'Ocean Breeze',
          description: 'Refreshing ocean-themed design with coastal elements and blue tones',
          price: 309,
          imageUrl: '/uploads/model-mc010.jpg',
          likes: 16,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC011',
          name: 'Autumn Leaves',
          description: 'Warm autumn colors and leaf patterns for fall celebrations',
          price: 329,
          imageUrl: '/uploads/model-mc011.jpg',
          likes: 22,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 279,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC012',
          name: 'Starry Night',
          description: 'Magical star patterns perfect for evening celebrations and dreamy events',
          price: 349,
          imageUrl: '/uploads/model-mc012.jpg',
          likes: 29,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 299,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC013',
          name: 'Tropical Paradise',
          description: 'Vibrant tropical design with palm leaves and exotic elements',
          price: 359,
          imageUrl: '/uploads/model-mc013.jpg',
          likes: 20,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC014',
          name: 'Minimalist Chic',
          description: 'Clean and modern minimalist design for contemporary celebrations',
          price: 289,
          imageUrl: '/uploads/model-mc014.jpg',
          likes: 17,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 239,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC015',
          name: 'Cherry Blossom',
          description: 'Delicate cherry blossom design inspired by Japanese aesthetics',
          price: 369,
          imageUrl: '/uploads/model-mc015.jpg',
          likes: 33,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 319,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC016',
          name: 'Art Deco Glamour',
          description: 'Glamorous Art Deco patterns for sophisticated and elegant events',
          price: 399,
          imageUrl: '/uploads/model-mc016.jpg',
          likes: 24,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC017',
          name: 'Bohemian Spirit',
          description: 'Free-spirited bohemian design with eclectic patterns and earth tones',
          price: 339,
          imageUrl: '/uploads/model-mc017.jpg',
          likes: 21,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 289,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC018',
          name: 'Galaxy Dreams',
          description: 'Cosmic-inspired design with galaxy patterns and stellar elements',
          price: 379,
          imageUrl: '/uploads/model-mc018.jpg',
          likes: 26,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 329,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC019',
          name: 'Garden Party',
          description: 'Fresh garden-themed design perfect for outdoor celebrations',
          price: 319,
          imageUrl: '/uploads/model-mc019.jpg',
          likes: 18,
          likedBy: [],
          isLateNightSpecial: false,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC020',
          name: 'Royal Crown',
          description: 'Majestic crown design for royal-themed celebrations and grand events',
          price: 429,
          imageUrl: '/uploads/model-mc020.jpg',
          likes: 35,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 379,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC021',
          name: 'Sunset Glow',
          description: 'Warm sunset colors perfect for evening celebrations and romantic moments',
          price: 349,
          imageUrl: '/uploads/model-mc021.jpg',
          likes: 23,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 299,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await wrappersCollection.insertMany(sampleWrappers);
      console.log('Sample wrappers created');
    } else {
      console.log('Wrappers already exist');
    }
    
    console.log('Database seeding completed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedDatabase();
}
