"use client";
import React from "react";
import { useCart } from "../providers/CartProvider";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    
    // In a real app, you would redirect to checkout
    alert('Proceeding to checkout...');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/">Home</Link> &gt; <span className="text-yellow-600 font-semibold">Cart</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="border-b">
                  <th className="py-4">Action</th>
                  <th>Image</th>
                  <th>Product Title</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Your cart is empty.</td></tr>
                ) : cartItems.map(item => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-2 text-center">
                      <button 
                        className="text-red-600 hover:text-red-800 text-xl"
                        onClick={() => removeFromCart(item.id)}
                      >
                        &times;
                      </button>
                    </td>
                    <td>
                      <img src={item.images?.[0] || "/images/logo-revoshop.jpg"} alt={item.title} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-400">SKU: {item.id}</div>
                    </td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>
                      <div className="flex items-center rounded w-max py-4">
                        <button
                          className="px-2 py-0 rounded-full border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xl"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 py-0 rounded-full border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xl"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="Coupon Code" className="border rounded px-3 py-2 flex-1 focus:outline-none focus:border-orange-400" />
              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-orange-400"
                onClick={() => alert('No Coupon for this period')}>
                Apply Coupon
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-6 border border-yellow-400">
            <h2 className="text-lg font-bold mb-4">Cart Totals</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button 
                className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-orange-400"
                onClick={handleCheckout}>
                Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}