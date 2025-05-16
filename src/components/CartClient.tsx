"use client";
import React, { useEffect, useState } from "react";
import { fetchProductById } from "../services/shopServices";

export default function CartClient() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      const stored = localStorage.getItem("cart");
      const cart = stored ? JSON.parse(stored) : [];
      // Fetch product details from API for each cart item
      const products = await Promise.all(
        cart.map(async (item: any) => {
          const prod = await fetchProductById(item.id);
          return prod ? { ...prod, quantity: item.quantity } : null;
        })
      );
      setCartItems(products.filter(Boolean));
      setLoading(false);
    }
    loadCart();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return (
    <div className="py-10 text-center text-gray-400 flex flex-col items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      Loading cart...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-4 text-sm text-gray-500">
        <a href="/">Home</a> &gt; <span className="text-yellow-600 font-semibold">Cart</span>
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
                      <button className="text-red-600 hover:text-red-800 text-xl">&times;</button>
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
                          onClick={() => {
                            const updatedCart = cartItems.map(ci =>
                              ci.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci
                            );
                            setCartItems(updatedCart);
                            localStorage.setItem('cart', JSON.stringify(updatedCart));
                          }}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 py-0 rounded-full border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xl"
                          onClick={() => {
                            const updatedCart = cartItems.map(ci =>
                              ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                            );
                            setCartItems(updatedCart);
                            localStorage.setItem('cart', JSON.stringify(updatedCart));
                          }}
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
              {/* <button 
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-orange-400"
                onClick={() => alert('Your Cart is Updated')}>Update Cart</button> */}
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
                onClick={() => alert('Your Product will Proceed to Checkout')}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}