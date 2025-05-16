'use client';
import { useRouter } from 'next/navigation';
import { Product } from '../types/type';   

export default function AddToCartButton({ product, quantity = 1 }: { product: Product, quantity?: number }) {
  const router = useRouter();
  function handleAddToCart() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      let cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    }
  }
  return (
    <button onClick={handleAddToCart} className="flex-1 bg-yellow-400 text-black rounded-full py-2 flex items-center justify-center gap-2 hover:bg-yellow-600 hover:text-white transition"><span className="fa-solid fa-cart-shopping"></span> Add to cart</button>
  );
}