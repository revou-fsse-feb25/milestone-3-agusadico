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
        <button className="bg-yellow-100 text-black px-3 py-1 rounded-xl hover:bg-yellow-400 hover:text-black text-sm w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="inline-block mr-1 align-text-bottom">
            <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm1.83-3.41l1.72-7.45A1 1 0 0 0 19.56 6H6.21l-.94-2.36A1 1 0 0 0 4.34 3H2v2h1.34l3.6 9.59-1.35 2.44A1.992 1.992 0 0 0 6 19c0 1.1.9 2 2 2h12v-2H8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.04zM6.16 8h12.31l-1.25 5.41H7.38L6.16 8z"/>
          </svg>
          Add to Cart
        </button>
        <Link href={`/${product.id}`} className="bg-yellow-400 text-black px-3 py-1 rounded-xl hover:bg-yellow-100 hover:text-black text-sm w-full text-center flex items-center justify-center gap-1">
          View Detail
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}