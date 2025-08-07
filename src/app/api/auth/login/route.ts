import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Processing admin login...');
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if admin exists
    let admin = await db.collection('admins').findOne({ username });
    
    // If no admin exists, create default admin
    if (!admin && username === process.env.ADMIN_USERNAME) {
      console.log('🆕 Creating default admin user...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      await db.collection('admins').insertOne({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        createdAt: new Date()
      });
      admin = await db.collection('admins').findOne({ username });
      console.log('✅ Default admin created');
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, you'd create a JWT or session here
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: { username: admin.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
