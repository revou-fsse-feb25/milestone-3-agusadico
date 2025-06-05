'use client';

import { Product } from '../types/type';
import ShopCard from './ShopCard';
import Link from 'next/link';
import { useCart } from '../providers/CartProvider';

export default function ShopRow({ products, viewMode }: { products: Product[], viewMode: 'card' | 'list' }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };
  
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map(product => (
          <div key={product.id} className="flex items-center gap-4 bg-white rounded shadow p-4">
            <img src={product.images[0]} alt={product.title} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-bold">{product.title}</div>
              <div className="text-black font-semibold">${product.price}</div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAddToCart(product)}
                className="bg-yellow-100 text-black px-3 py-1 rounded hover:bg-yellow-400 text-sm"
              >
                Add to Cart
              </button>
              <Link href={`/${product.id}`} className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-100 text-sm">View Detail</Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <ShopCard key={product.id} product={product} />
      ))}
    </div>
  );
}