import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all existing model numbers
    const existingWrappers = await db
      .collection('wrappers')
      .find({}, { projection: { modelNumber: 1 } })
      .sort({ modelNumber: -1 })
      .toArray();
    
    let nextNumber = 1;
    if (existingWrappers.length > 0) {
      // Extract the highest model number
      const modelNumbers = existingWrappers
        .map(w => w.modelNumber)
        .filter(mn => mn?.startsWith('MC'))
        .map(mn => parseInt(mn.substring(2)))
        .filter(num => !isNaN(num));
      
      if (modelNumbers.length > 0) {
        nextNumber = Math.max(...modelNumbers) + 1;
      }
    }
    
    const nextModelNumber = `MC${nextNumber.toString().padStart(3, '0')}`;
    
    return NextResponse.json({
      success: true,
      nextModelNumber,
      existingCount: existingWrappers.length
    });

  } catch (error) {
    console.error('Get next model number error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get next model number' },
      { status: 500 }
    );
  }
}
