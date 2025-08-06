// Simple API endpoint to seed data
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Create admin user
    const adminExists = await db.collection('admins').findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('ManaChoco2025!', 10);
      await db.collection('admins').insertOne({
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
    }
    
    // Add sample wrappers
    const wrappersExist = await db.collection('wrappers').countDocuments();
    if (wrappersExist === 0) {
      const sampleWrappers = [
        {
          modelNumber: 'MC001',
          name: 'Elegant Rose Garden',
          description: 'Beautiful rose-themed wrapper perfect for romantic occasions',
          price: 299,
          imageUrl: '/uploads/model-mc001.jpg',
          likes: 0,
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
          likes: 0,
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
          likes: 0,
          likedBy: [],
          isLateNightSpecial: true,
          lateNightPrice: 279,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.collection('wrappers').insertMany(sampleWrappers);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed database', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
