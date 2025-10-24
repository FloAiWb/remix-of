import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const featured = searchParams.get('featured');

    let query = db.select().from(testimonials);

    if (featured === 'true') {
      query = query.where(eq(testimonials.isFeatured, true));
    }

    const results = await query.limit(limit).offset(offset);

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
    const { name, rating, text, image, date, isFeatured } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating is required', code: 'MISSING_RATING' },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required', code: 'MISSING_TEXT' },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required', code: 'MISSING_IMAGE' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required', code: 'MISSING_DATE' },
        { status: 400 }
      );
    }

    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        name: name.trim(),
        rating: ratingValue,
        text: text.trim(),
        image: image.trim(),
        date: date.trim(),
        isFeatured: isFeatured !== undefined ? isFeatured : true,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newTestimonial[0], { status: 201 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, rating, text, image, date, isFeatured } = body;

    const existing = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (rating !== undefined) {
      const ratingValue = parseInt(rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
          { status: 400 }
        );
      }
    }

    const updates: any = {};

    if (name !== undefined) updates.name = name.trim();
    if (rating !== undefined) updates.rating = parseInt(rating);
    if (text !== undefined) updates.text = text.trim();
    if (image !== undefined) updates.image = image.trim();
    if (date !== undefined) updates.date = date.trim();
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;

    const updated = await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, parseInt(id)))
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Testimonial deleted successfully',
        testimonial: deleted[0],
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