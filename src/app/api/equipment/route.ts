import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipment } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single equipment by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const result = await db
        .select()
        .from(equipment)
        .where(eq(equipment.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Equipment not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = db.select().from(equipment);

    // Apply filters
    if (type && search) {
      query = query.where(
        or(
          eq(equipment.type, type),
          like(equipment.name, `%${search}%`),
          like(equipment.type, `%${search}%`),
          like(equipment.description, `%${search}%`)
        )
      );
    } else if (type) {
      query = query.where(eq(equipment.type, type));
    } else if (search) {
      query = query.where(
        or(
          like(equipment.name, `%${search}%`),
          like(equipment.type, `%${search}%`),
          like(equipment.description, `%${search}%`)
        )
      );
    }

    const results = await query
      .orderBy(desc(equipment.createdAt))
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
    const { name, power, type, description, features, specifications, price, imageUrl } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!power || typeof power !== 'string' || power.trim() === '') {
      return NextResponse.json(
        { error: 'Power is required and must be a non-empty string', code: 'INVALID_POWER' },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json(
        { error: 'Type is required and must be a non-empty string', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and must be a non-empty string', code: 'INVALID_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features is required and must be an array', code: 'INVALID_FEATURES' },
        { status: 400 }
      );
    }

    if (specifications !== undefined && specifications !== null && typeof specifications !== 'object') {
      return NextResponse.json(
        { error: 'Specifications must be an object if provided', code: 'INVALID_SPECIFICATIONS' },
        { status: 400 }
      );
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price is required and must be a positive integer', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Create new equipment
    const newEquipment = await db
      .insert(equipment)
      .values({
        name: name.trim(),
        power: power.trim(),
        type: type.trim(),
        description: description.trim(),
        features: features,
        specifications: specifications || null,
        price: price,
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newEquipment[0], { status: 201 });
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

    // Check if equipment exists
    const existing = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and prepare updates
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = body.name.trim();
    }

    if (body.power !== undefined) {
      if (typeof body.power !== 'string' || body.power.trim() === '') {
        return NextResponse.json(
          { error: 'Power must be a non-empty string', code: 'INVALID_POWER' },
          { status: 400 }
        );
      }
      updates.power = body.power.trim();
    }

    if (body.type !== undefined) {
      if (typeof body.type !== 'string' || body.type.trim() === '') {
        return NextResponse.json(
          { error: 'Type must be a non-empty string', code: 'INVALID_TYPE' },
          { status: 400 }
        );
      }
      updates.type = body.type.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim() === '') {
        return NextResponse.json(
          { error: 'Description must be a non-empty string', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if (body.features !== undefined) {
      if (!Array.isArray(body.features)) {
        return NextResponse.json(
          { error: 'Features must be an array', code: 'INVALID_FEATURES' },
          { status: 400 }
        );
      }
      updates.features = body.features;
    }

    if (body.specifications !== undefined) {
      if (body.specifications !== null && typeof body.specifications !== 'object') {
        return NextResponse.json(
          { error: 'Specifications must be an object', code: 'INVALID_SPECIFICATIONS' },
          { status: 400 }
        );
      }
      updates.specifications = body.specifications;
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive integer', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
      updates.price = body.price;
    }

    if (body.imageUrl !== undefined) {
      if (typeof body.imageUrl !== 'string' || body.imageUrl.trim() === '') {
        return NextResponse.json(
          { error: 'Image URL must be a non-empty string', code: 'INVALID_IMAGE_URL' },
          { status: 400 }
        );
      }
      updates.imageUrl = body.imageUrl.trim();
    }

    // Update equipment
    const updated = await db
      .update(equipment)
      .set(updates)
      .where(eq(equipment.id, parseInt(id)))
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

    // Check if equipment exists
    const existing = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete equipment
    const deleted = await db
      .delete(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Equipment deleted successfully',
        deleted: deleted[0],
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