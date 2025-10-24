import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single submission by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const submission = await db
        .select()
        .from(contactSubmissions)
        .where(eq(contactSubmissions.id, parseInt(id)))
        .limit(1);

      if (submission.length === 0) {
        return NextResponse.json(
          { error: 'Submission not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(submission[0], { status: 200 });
    }

    // List submissions with optional filtering
    let query = db.select().from(contactSubmissions);

    if (status) {
      query = query.where(eq(contactSubmissions.status, status));
    }

    const results = await query
      .orderBy(desc(contactSubmissions.createdAt))
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
    const { name, phone, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return NextResponse.json(
        { error: 'Phone is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    // Create new submission
    const newSubmission = await db
      .insert(contactSubmissions)
      .values({
        name: name.trim(),
        phone: phone.trim(),
        message: message ? message.trim() : null,
        status: 'new',
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newSubmission[0], { status: 201 });
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
    const { status } = body;

    // Validate status
    const validStatuses = ['new', 'in_progress', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: 'Status must be one of: new, in_progress, resolved',
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if submission exists
    const existing = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update submission
    const updated = await db
      .update(contactSubmissions)
      .set({
        status,
      })
      .where(eq(contactSubmissions.id, parseInt(id)))
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

    // Check if submission exists
    const existing = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete submission
    const deleted = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Submission deleted successfully',
        submission: deleted[0],
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