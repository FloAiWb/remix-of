import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryWorks } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db.select()
      .from(galleryWorks)
      .orderBy(asc(galleryWorks.orderIndex))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, title, orderIndex } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required', code: 'MISSING_IMAGE' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    const trimmedImage = image.trim();
    const trimmedTitle = title.trim();

    if (!trimmedImage) {
      return NextResponse.json(
        { error: 'Image cannot be empty', code: 'EMPTY_IMAGE' },
        { status: 400 }
      );
    }

    if (!trimmedTitle) {
      return NextResponse.json(
        { error: 'Title cannot be empty', code: 'EMPTY_TITLE' },
        { status: 400 }
      );
    }

    const newGalleryWork = await db.insert(galleryWorks)
      .values({
        image: trimmedImage,
        title: trimmedTitle,
        orderIndex: orderIndex ?? 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newGalleryWork[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.image !== undefined) {
      const trimmedImage = body.image.trim();
      if (!trimmedImage) {
        return NextResponse.json(
          { error: 'Image cannot be empty', code: 'EMPTY_IMAGE' },
          { status: 400 }
        );
      }
      updates.image = trimmedImage;
    }

    if (body.title !== undefined) {
      const trimmedTitle = body.title.trim();
      if (!trimmedTitle) {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'EMPTY_TITLE' },
          { status: 400 }
        );
      }
      updates.title = trimmedTitle;
    }

    if (body.orderIndex !== undefined) {
      updates.orderIndex = body.orderIndex;
    }

    const existing = await db.select()
      .from(galleryWorks)
      .where(eq(galleryWorks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Gallery work not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updated = await db.update(galleryWorks)
      .set(updates)
      .where(eq(galleryWorks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existing = await db.select()
      .from(galleryWorks)
      .where(eq(galleryWorks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Gallery work not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(galleryWorks)
      .where(eq(galleryWorks.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Gallery work deleted successfully',
        deleted: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}