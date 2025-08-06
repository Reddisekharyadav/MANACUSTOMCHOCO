import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isLateNightHours } from '@/lib/utils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeScheduled = searchParams.get('includeScheduled') === 'true';

    const { db } = await connectToDatabase();
    
    // Simplified query - return all active wrappers
    let query: Record<string, unknown> = {};
    
    // Only filter by scheduling if specified
    if (!includeScheduled) {
      query = {
        $or: [
          { scheduledDate: { $exists: false } },
          { scheduledDate: null },
          { scheduledDate: { $lte: new Date() } }
        ]
      };
    }

    const wrappers = await db
      .collection('wrappers')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Add late night pricing if applicable
    const isLateNight = isLateNightHours();
    const wrappersWithPricing = wrappers.map(wrapper => ({
      ...wrapper,
      _id: wrapper._id.toString(),
      currentPrice: isLateNight && wrapper.lateNightPrice ? wrapper.lateNightPrice : wrapper.price,
      isLateNightActive: isLateNight && wrapper.isLateNightSpecial
    }));

    return NextResponse.json({
      success: true,
      wrappers: wrappersWithPricing,
      isLateNight
    });

  } catch (error) {
    console.error('Get wrappers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wrappers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const isLateNightSpecial = formData.get('isLateNightSpecial') === 'true';
    const lateNightPrice = formData.get('lateNightPrice') ? parseFloat(formData.get('lateNightPrice') as string) : undefined;
    const scheduledDate = formData.get('scheduledDate') ? new Date(formData.get('scheduledDate') as string) : undefined;

    if (!name || !price || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and image are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Generate auto-increment model number
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
    
    const modelNumber = `MC${nextNumber.toString().padStart(3, '0')}`;
    
    const wrapper = {
      modelNumber,
      name,
      description: description || '',
      price,
      imageUrl,
      likes: 0,
      likedBy: [],
      isLateNightSpecial: isLateNightSpecial || false,
      lateNightPrice,
      scheduledDate,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('wrappers').insertOne(wrapper);

    return NextResponse.json({
      success: true,
      message: 'Wrapper created successfully',
      wrapperId: result.insertedId.toString(),
      modelNumber: modelNumber
    });

  } catch (error) {
    console.error('Create wrapper error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create wrapper' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, name, price, description } = body;

    if (!_id || !name || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID, name, and price are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const updateData = {
      name,
      price,
      description: description || '',
      updatedAt: new Date()
    };

    const result = await db.collection('wrappers').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Wrapper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Wrapper updated successfully'
    });

  } catch (error) {
    console.error('Update wrapper error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update wrapper' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Wrapper ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('wrappers').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Wrapper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Wrapper deleted successfully'
    });

  } catch (error) {
    console.error('Delete wrapper error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete wrapper' },
      { status: 500 }
    );
  }
}
