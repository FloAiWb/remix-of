import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const showAll = searchParams.get('all') === 'true';

    let query = db.select().from(faqs);

    if (!showAll) {
      query = query.where(eq(faqs.isPublished, true));
    }

    const results = await query
      .orderBy(asc(faqs.orderIndex))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, orderIndex, isPublished } = body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json(
        { error: 'Question is required', code: 'MISSING_QUESTION' },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== 'string' || answer.trim() === '') {
      return NextResponse.json(
        { error: 'Answer is required', code: 'MISSING_ANSWER' },
        { status: 400 }
      );
    }

    const newFaq = await db
      .insert(faqs)
      .values({
        question: question.trim(),
        answer: answer.trim(),
        orderIndex: typeof orderIndex === 'number' ? orderIndex : 0,
        isPublished: typeof isPublished === 'boolean' ? isPublished : true,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFaq[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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
    const { question, answer, orderIndex, isPublished } = body;

    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: any = {};

    if (question !== undefined) {
      if (typeof question !== 'string' || question.trim() === '') {
        return NextResponse.json(
          { error: 'Question must be a non-empty string', code: 'INVALID_QUESTION' },
          { status: 400 }
        );
      }
      updates.question = question.trim();
    }

    if (answer !== undefined) {
      if (typeof answer !== 'string' || answer.trim() === '') {
        return NextResponse.json(
          { error: 'Answer must be a non-empty string', code: 'INVALID_ANSWER' },
          { status: 400 }
        );
      }
      updates.answer = answer.trim();
    }

    if (orderIndex !== undefined) {
      if (typeof orderIndex !== 'number') {
        return NextResponse.json(
          { error: 'Order index must be a number', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
      updates.orderIndex = orderIndex;
    }

    if (isPublished !== undefined) {
      if (typeof isPublished !== 'boolean') {
        return NextResponse.json(
          { error: 'Is published must be a boolean', code: 'INVALID_IS_PUBLISHED' },
          { status: 400 }
        );
      }
      updates.isPublished = isPublished;
    }

    const updatedFaq = await db
      .update(faqs)
      .set(updates)
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFaq[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedFaq = await db
      .delete(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'FAQ deleted successfully',
        faq: deletedFaq[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}