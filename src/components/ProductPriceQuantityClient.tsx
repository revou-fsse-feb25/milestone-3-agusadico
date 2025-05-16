"use client";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
//import QuantitySelector from "./QuantitySelector";
import { Product } from "../types/type";

export default function ProductPriceQuantityClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => q + 1);
  return (
    <>
      <div className="text-5xl font-bold mb-2">${product.price * quantity}.00</div>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-3 py-1 rounded-full border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xl"
          onClick={handleDecrease}
        >-</button>
        <span className="mx-2 text-lg">{quantity}</span>
        <button
          className="px-3 py-1 rounded-full border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xl"
          onClick={handleIncrease}
        >+</button>
        <AddToCartButton product={product} quantity={quantity} />
      </div>
    </>
  );
}