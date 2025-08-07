import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Checking MongoDB connection...');
    
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({
        error: 'MONGODB_URI not found',
        env: process.env.NODE_ENV
      }, { status: 500 });
    }

    // Try to import and test connection
    const { connectToDatabase } = await import('@/lib/mongodb');
    
    const startTime = Date.now();
    const { db } = await connectToDatabase();
    const endTime = Date.now();
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    const wrapperCount = await db.collection('wrappers').countDocuments();
    const adminCount = await db.collection('admins').countDocuments();
    
    return NextResponse.json({
      success: true,
      connectionTime: `${endTime - startTime}ms`,
      database: 'manacustomchoco',
      collections: collections.map(c => c.name),
      counts: {
        wrappers: wrapperCount,
        admins: adminCount
      },
      mongoUri: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') // Hide password
    });

  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'Present' : 'Missing'
    }, { status: 500 });
  }
}
