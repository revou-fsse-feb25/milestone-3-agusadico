"use client";
import React, { useState, useRef } from "react";
import { searchProductsByTitle } from "../services/shopServices";
import { Product } from "../types/type";
import Link from "next/link";

export default function NavbarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      // Only search if the value contains a space or is at least 3 characters long
      if (value.trim().includes(" ") || value.trim().length >= 3) {
        setSearching(true);
        try {
          const results = await searchProductsByTitle(value);
          setSearchResults(results);
        } catch (error) {
          setSearchResults([]);
        }
        setSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 350);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={e => e.preventDefault()} className="flex w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border-2 border-yellow-400 rounded-l-full focus:border-orange-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-400 text-white rounded-r-full hover:bg-yellow-500 transition-colors"
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>
      {searchTerm && !searching && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto flex items-center justify-center py-8">
          <span className="text-gray-500 text-lg font-semibold">Oops! We couldn’t find what you're looking for. Want to try another search?</span>
        </div>
      )}
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/${product.id}`}
              className="block"
            >
              <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-b last:border-b-0">
                <img
                  src={product.images?.[0] || "/images/logo-revoshop.jpg"}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded mr-4 border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-gray-900">{product.title}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">${product.oldPrice.toLocaleString()}</span>
                    )}
                    <span className="text-orange-600 font-bold">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}