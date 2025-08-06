import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { wrapperId, userId } = await request.json();

    if (!wrapperId) {
      return NextResponse.json(
        { success: false, message: 'Wrapper ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const wrapper = await db.collection('wrappers').findOne({
      _id: new ObjectId(wrapperId)
    });

    if (!wrapper) {
      return NextResponse.json(
        { success: false, message: 'Wrapper not found' },
        { status: 404 }
      );
    }

    // Use IP address as user identifier if no userId provided
    const userIdentifier = userId || request.headers.get('x-forwarded-for') || 'anonymous';
    
    const hasLiked = wrapper.likedBy?.includes(userIdentifier);
    
    let updateQuery;
    let newLikes;

    if (hasLiked) {
      // Unlike
      updateQuery = {
        $inc: { likes: -1 },
        $pull: { likedBy: userIdentifier }
      };
      newLikes = wrapper.likes - 1;
    } else {
      // Like
      updateQuery = {
        $inc: { likes: 1 },
        $addToSet: { likedBy: userIdentifier }
      };
      newLikes = wrapper.likes + 1;
    }

    await db.collection('wrappers').updateOne(
      { _id: new ObjectId(wrapperId) },
      updateQuery
    );

    return NextResponse.json({
      success: true,
      likes: newLikes,
      liked: !hasLiked,
      message: hasLiked ? 'Wrapper unliked' : 'Wrapper liked'
    });

  } catch (error) {
    console.error('Like wrapper error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update like status' },
      { status: 500 }
    );
  }
}
