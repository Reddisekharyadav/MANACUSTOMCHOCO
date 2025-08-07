import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('🌱 Starting database seeding...');
    
    const { db } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('ManaChoco2025!', 12);
      await db.collection('admins').insertOne({
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check if wrappers already exist
    const existingWrappers = await db.collection('wrappers').countDocuments();
    
    if (existingWrappers === 0) {
      // Add sample wrappers with local images
      const sampleWrappers = [
        {
          modelNumber: 'MC001',
          name: 'Elegant Rose Garden',
          description: 'Beautiful rose-themed wrapper perfect for romantic occasions and special celebrations',
          price: 299,
          isLateNightSpecial: true,
          lateNightPrice: 249,
          imageUrl: '/uploads/model-mc001.jpg',
          likes: 15,
          likedBy: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC002',
          name: 'Golden Celebration',
          description: 'Luxurious golden design ideal for weddings and premium celebrations',
          price: 349,
          isLateNightSpecial: false,
          lateNightPrice: 349,
          imageUrl: '/uploads/model-mc002.jpg',
          likes: 23,
          likedBy: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC003',
          name: 'Royal Blue Elegance',
          description: 'Sophisticated blue wrapper with elegant patterns for distinguished events',
          price: 329,
          isLateNightSpecial: true,
          lateNightPrice: 279,
          imageUrl: '/uploads/model-mc003.jpg',
          likes: 18,
          likedBy: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC004',
          name: 'Vintage Charm',
          description: 'Classic vintage-inspired design with timeless appeal and nostalgic elements',
          price: 359,
          isLateNightSpecial: false,
          lateNightPrice: 359,
          imageUrl: '/uploads/model-mc004.jpg',
          likes: 12,
          likedBy: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          modelNumber: 'MC005',
          name: 'Modern Minimalist',
          description: 'Clean, contemporary design perfect for modern celebrations and events',
          price: 289,
          isLateNightSpecial: true,
          lateNightPrice: 239,
          imageUrl: '/uploads/model-mc005.jpg',
          likes: 27,
          likedBy: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await db.collection('wrappers').insertMany(sampleWrappers);
      console.log(`✅ Added ${sampleWrappers.length} sample wrappers`);
    } else {
      console.log(`ℹ️ Database already has ${existingWrappers} wrappers`);
    }

    const wrapperCount = await db.collection('wrappers').countDocuments();
    const adminCount = await db.collection('admins').countDocuments();

    return NextResponse.json({
      message: 'Database seeded successfully!',
      data: {
        wrappers: wrapperCount,
        admins: adminCount
      }
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
