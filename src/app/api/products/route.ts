// ... existing code ...
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../types/type';

// In-memory product store for demo (replace with DB in production)
export let products: Product[] = [];

// Export a function to reset products for testing
export function resetProducts() {
  products = [];
}

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newProduct = { ...data, id: Date.now().toString() };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const idx = products.findIndex(p => p.id === data.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = { ...products[idx], ...data };
  return NextResponse.json(products[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  products = products.filter(p => p.id !== id);
  return NextResponse.json({ success: true });
}
// ... existing code ...