// Script to populate MongoDB Atlas through your deployed API
const fetch = require('node-fetch');

const API_BASE = 'https://manacustomchoco.vercel.app';

// Sample wrappers data
const wrappers = [
  {
    name: "Elegant Rose Garden",
    description: "Beautiful rose-themed wrapper perfect for romantic occasions and special celebrations",
    price: 299,
    imageUrl: "/uploads/model-mc001.jpg",
    isLateNightSpecial: true,
    lateNightPrice: 249
  },
  {
    name: "Golden Celebration",
    description: "Luxurious golden design ideal for weddings and premium celebrations",
    price: 349,
    imageUrl: "/uploads/model-mc002.jpg",
    isLateNightSpecial: false
  },
  {
    name: "Royal Blue Elegance",
    description: "Sophisticated blue wrapper with elegant patterns for distinguished events",
    price: 329,
    imageUrl: "/uploads/model-mc003.jpg",
    isLateNightSpecial: true,
    lateNightPrice: 279
  },
  {
    name: "Vintage Charm",
    description: "Classic vintage-inspired design with timeless appeal and nostalgic elements",
    price: 359,
    imageUrl: "/uploads/model-mc004.jpg",
    isLateNightSpecial: false
  },
  {
    name: "Modern Minimalist",
    description: "Clean, contemporary design perfect for modern celebrations and events",
    price: 289,
    imageUrl: "/uploads/model-mc005.jpg",
    isLateNightSpecial: true,
    lateNightPrice: 239
  },
  {
    name: "Tropical Paradise",
    description: "Vibrant tropical design with exotic colors and botanical elements",
    price: 319,
    imageUrl: "/uploads/model-mc006.jpg",
    isLateNightSpecial: false
  },
  {
    name: "Midnight Mystery",
    description: "Dark, mysterious design with metallic accents and starry patterns",
    price: 339,
    imageUrl: "/uploads/model-mc007.jpg",
    isLateNightSpecial: true,
    lateNightPrice: 299
  },
  {
    name: "Sweet Spring",
    description: "Fresh spring design with pastel colors and blooming flower motifs",
    price: 279,
    imageUrl: "/uploads/model-mc008.jpg",
    isLateNightSpecial: false
  }
];

async function populateDatabase() {
  console.log('🚀 Starting to populate MongoDB Atlas through API...\n');
  
  for (let i = 0; i < wrappers.length; i++) {
    const wrapper = wrappers[i];
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('name', wrapper.name);
      formData.append('description', wrapper.description);
      formData.append('price', wrapper.price.toString());
      formData.append('imageUrl', wrapper.imageUrl);
      formData.append('isLateNightSpecial', wrapper.isLateNightSpecial.toString());
      
      if (wrapper.lateNightPrice) {
        formData.append('lateNightPrice', wrapper.lateNightPrice.toString());
      }
      
      // Send to API
      const response = await fetch(`${API_BASE}/api/wrappers`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Added: ${wrapper.name} (Model: ${result.modelNumber || 'MC' + String(i + 1).padStart(3, '0')})`);
      } else {
        console.log(`❌ Failed: ${wrapper.name} - ${result.message}`);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error adding ${wrapper.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Finished populating database!');
  console.log('🌐 Visit https://manacustomchoco.vercel.app to see your wrappers!');
}

populateDatabase();
