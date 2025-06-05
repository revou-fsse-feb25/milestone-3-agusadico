// Copy the entire contents of route.ts here
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

// Copy the rest of the file...