import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('📁 File received:', {
      name: file?.name,
      type: file?.type,
      size: file?.size
    });

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    console.log('✅ File validation passed, uploading to Supabase...');

    // Upload to Supabase Storage
    const publicUrl = await uploadFileToSupabase(file, 'product-images', 'uploads');

    if (!publicUrl) {
      console.error('❌ Upload failed: No URL returned');
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    console.log('✅ Upload successful:', publicUrl);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('❌ Upload API error:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}