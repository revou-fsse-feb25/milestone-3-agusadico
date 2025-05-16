"use client";
import { useState } from "react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-8 h-8 rounded border text-lg"
        onClick={() => setQuantity(q => Math.max(1, q - 1))}
      >-</button>
      <span className="font-semibold">{quantity}</span>
      <button
        className="w-8 h-8 rounded border text-lg"
        onClick={() => setQuantity(q => q + 1)}
      >+</button>
    </div>
  );
}