import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../types/type';

// In-memory product store for demo (replace with DB in production)
let products: Product[] = [];

// Helper function to reset products for testing
// Export for testing purposes but mark as internal
/** @internal */
export function resetProducts() {
  products = [];
  return true; // Return value to ensure function execution is covered
}

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newProduct = { ...data, id: Date.now().toString() };
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    // Handle JSON parsing errors
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || !data.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    const idx = products.findIndex(p => p.id === data.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    products[idx] = { ...products[idx], ...data };
    return NextResponse.json(products[idx]);
  } catch (error) {
    // Handle JSON parsing errors
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || !data.id) {
      // Still return success for idempotency
      return NextResponse.json({ success: true });
    }
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== data.id);
    
    return NextResponse.json({ 
      success: true,
      deleted: initialLength > products.length
    });
  } catch (error) {
    // Handle JSON parsing errors but still return success for idempotency
    return NextResponse.json({ success: true, error: 'Invalid request data' });
  }
}