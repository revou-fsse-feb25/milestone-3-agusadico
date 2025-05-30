"use client";
import React, { useState, useRef, useEffect } from "react";
import { searchProductsByTitle } from "../services/shopServices";
import { Product } from "../types/type";
import Link from "next/link";
import { useDebounce } from "../hooks/useDebounce";

export default function NavbarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use our custom useDebounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  
  // Effect to handle the debounced search term
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    if (!isTyping) {
      const performSearch = async () => {
        setSearching(true);
        try {
          // Get results from API
          const results = await searchProductsByTitle(debouncedSearchTerm);
          
          // Check if the search term is a complete word in the product title
          const matches = results.filter(product => {
            const productTitle = product.title.toLowerCase();
            const searchValue = debouncedSearchTerm.toLowerCase();
            
            // Split the product title into words
            const words = productTitle.split(/\s+/);
            
            // Check if any word in the product title matches the search term
            return words.some(word => word === searchValue);
          });
          
          setSearchResults(matches);
          setHasSearched(true);
        } catch (error) {
          setSearchResults([]);
          setHasSearched(true);
        }
        setSearching(false);
      };
      
      performSearch();
    }
  }, [debouncedSearchTerm, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    setHasSearched(false);
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (value.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      setIsTyping(false);
      return;
    }
    
    // Set a timeout to detect when user has stopped typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 800);
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
          disabled={searching || isTyping}
        >
          {searching ? "Searching..." : isTyping ? "Typing..." : "Search"}
        </button>
      </form>
      {searchTerm && !searching && !isTyping && hasSearched && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto flex items-center justify-center py-8">
          <span className="text-gray-500 text-lg font-semibold">Product not found</span>
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