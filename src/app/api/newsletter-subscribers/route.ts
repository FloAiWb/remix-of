import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const showAll = searchParams.get('all') === 'true';

    let query = db.select().from(newsletterSubscribers);

    if (!showAll) {
      query = query.where(eq(newsletterSubscribers.isActive, true));
    }

    const results = await query
      .limit(limit)
      .offset(offset)
      .orderBy(newsletterSubscribers.subscribedAt);

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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, trimmedEmail))
      .limit(1);

    if (existingSubscriber.length > 0) {
      const subscriber = existingSubscriber[0];

      if (subscriber.isActive) {
        return NextResponse.json(
          { error: 'Already subscribed', code: 'ALREADY_SUBSCRIBED' },
          { status: 400 }
        );
      }

      const reactivated = await db
        .update(newsletterSubscribers)
        .set({
          isActive: true,
          subscribedAt: new Date().toISOString(),
          unsubscribedAt: null,
        })
        .where(eq(newsletterSubscribers.email, trimmedEmail))
        .returning();

      return NextResponse.json(reactivated[0], { status: 201 });
    }

    const newSubscriber = await db
      .insert(newsletterSubscribers)
      .values({
        email: trimmedEmail,
        isActive: true,
        subscribedAt: new Date().toISOString(),
        unsubscribedAt: null,
      })
      .returning();

    return NextResponse.json(newSubscriber[0], { status: 201 });
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
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, trimmedEmail))
      .limit(1);

    if (existingSubscriber.length === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const subscriber = existingSubscriber[0];

    if (!subscriber.isActive) {
      return NextResponse.json(
        { error: 'Already unsubscribed', code: 'ALREADY_UNSUBSCRIBED' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(newsletterSubscribers)
      .set({
        isActive: false,
        unsubscribedAt: new Date().toISOString(),
      })
      .where(eq(newsletterSubscribers.email, trimmedEmail))
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

    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .limit(1);

    if (existingSubscriber.length === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Subscriber deleted successfully',
        subscriber: deleted[0],
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