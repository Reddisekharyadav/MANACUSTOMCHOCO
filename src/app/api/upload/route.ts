import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const filename = `wrapper_${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
