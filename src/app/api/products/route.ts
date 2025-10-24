import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single product by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, parseInt(id)))
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product[0], { status: 200 });
    }

    // List products with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('is_new');
    const isBestseller = searchParams.get('is_bestseller');

    // Build filter conditions dynamically
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (featured === 'true') {
      conditions.push(eq(products.featured, true));
    } else if (featured === 'false') {
      conditions.push(eq(products.featured, false));
    }

    if (isNew === 'true') {
      conditions.push(eq(products.isNew, true));
    } else if (isNew === 'false') {
      conditions.push(eq(products.isNew, false));
    }

    if (isBestseller === 'true') {
      conditions.push(eq(products.isBestseller, true));
    } else if (isBestseller === 'false') {
      conditions.push(eq(products.isBestseller, false));
    }

    let query = db.select().from(products);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
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

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!body.price || typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price is required and must be a positive integer', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and must be a non-empty string', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!body.images || !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: 'Images is required and must be an array', code: 'INVALID_IMAGES' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      name: body.name.trim(),
      price: Math.floor(body.price),
      description: body.description.trim(),
      category: body.category.trim(),
      images: body.images,
      material: body.material ? body.material.trim() : null,
      featured: body.featured === true,
      isNew: body.isNew === true,
      isBestseller: body.isBestseller === true,
      createdAt: now,
      updatedAt: now,
    };

    const newProduct = await db
      .insert(products)
      .values(insertData)
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive integer', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (body.description !== undefined && (typeof body.description !== 'string' || body.description.trim() === '')) {
      return NextResponse.json(
        { error: 'Description must be a non-empty string', code: 'INVALID_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (body.category !== undefined && (typeof body.category !== 'string' || body.category.trim() === '')) {
      return NextResponse.json(
        { error: 'Category must be a non-empty string', code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    if (body.images !== undefined && !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: 'Images must be an array', code: 'INVALID_IMAGES' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.price !== undefined) updateData.price = Math.floor(body.price);
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.images !== undefined) updateData.images = body.images;
    if (body.material !== undefined) updateData.material = body.material ? body.material.trim() : null;
    if (body.featured !== undefined) updateData.featured = body.featured === true;
    if (body.isNew !== undefined) updateData.isNew = body.isNew === true;
    if (body.isBestseller !== undefined) updateData.isBestseller = body.isBestseller === true;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Product deleted successfully',
        product: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}