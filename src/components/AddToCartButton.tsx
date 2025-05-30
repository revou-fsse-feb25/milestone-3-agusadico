'use client';
import { useRouter } from 'next/navigation';
import { Product } from '../types/type';
import { useCart } from '../providers/CartProvider';

export default function AddToCartButton({ product, quantity = 1 }: { product: Product, quantity?: number }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  function handleAddToCart() {
    addToCart(product, quantity);
    router.push('/cart');
  }
  
  return (
    <button onClick={handleAddToCart} className="flex-1 bg-yellow-400 text-black rounded-full py-2 flex items-center justify-center gap-2 hover:bg-yellow-600 hover:text-white transition">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill" viewBox="0 0 16 16">
         <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>
  Add to Cart</button>
  );
}