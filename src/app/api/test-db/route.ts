import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const { db } = await connectToDatabase();
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    const wrapperCount = await db.collection('wrappers').countDocuments();
    const adminCount = await db.collection('admins').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      data: {
        collections: collections.map(c => c.name),
        wrapperCount,
        adminCount,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
