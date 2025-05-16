'use client';
import Link from 'next/link';
import { Product } from '../types/type';
import { useState } from 'react';

export default function ShopCard({ product }: { product: Product }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg transition flex flex-col items-center">
      <div className="w-full flex justify-end mb-2">
        <button
          className={`text-2xl ${favorite ? 'text-red-500' : 'text-gray-400'} transition-colors`}
          onClick={() => setFavorite(fav => !fav)}
          aria-label="Add to favorite"
          type="button"
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
      <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded" />
      <div className="mt-2 font-bold text-center">{product.title}</div>
      <div className="text-black font-semibold text-center">${product.price}</div>
      <div className="flex gap-2 mt-3 w-full">
        <button className="bg-yellow-100 text-black px-3 py-1 rounded-xl hover:bg-yellow-400 hover:text-black text-sm w-full"><span className="fa-solid fa-basket-shopping"></span> Add to Cart</button>
        <Link href={`/${product.id}`} className="bg-yellow-400 text-black px-3 py-1 rounded-xl hover:bg-yellow-100 hover:text-black text-sm w-full text-center">View Detail <span className="fa-solid fa-angles-right"></span></Link>
      </div>
    </div>
  );
}