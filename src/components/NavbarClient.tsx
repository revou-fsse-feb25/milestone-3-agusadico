'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Category } from '../types/type';
import NavbarSearch from './NavbarSearch';
import NavbarAuthWrapper from './NavbarAuthWrapper';

export default function NavbarClient() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories on client side
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories'); // Adjust this endpoint as needed
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="w-full bg-white">
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3 gap-x-6">
            {/* Left: Logo & Category (hide category on mobile) */}
            <div className="flex items-center gap-4 min-w-[120px]">
            <Link href="/">
              <Image src="/images/logo-revoshop.jpg" alt="Logo" width={120} height={40} />
            </Link>
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none shadow-sm">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  All Categories
                  <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-20 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200">
                  <ul className="py-2">
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <a href={`#category-${cat.slug}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 text-gray-700">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                          <span className="font-medium">{cat.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Center: Search Bar (hide on mobile) */}
            <div className="hidden md:flex flex-1 justify-center">
              <NavbarSearch />
            </div>
            {/* Hamburger Button (mobile only) */}
            <div className="md:hidden flex items-center">
              <span className="fa-solid fa-bars text-gray-500 text-2xl"></span>
            </div>
            {/* Right: Icons (hide on mobile) */}
            <div className="hidden md:flex items-center gap-6 min-w-[180px] justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill text-gray-500" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill text-gray-500" viewBox="0 0 16 16">
                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
              </svg>
              <Link href="/cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-basket-fill text-gray-500 hover:text-orange-500" viewBox="0 0 16 16">
                  <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0z"/>
                </svg>
              </Link>
              <NavbarAuthWrapper />
            {/* <span>Logout</span> */}
            </div>
          </div>
        </nav>
        {/* Lower Nav: Hide on mobile, show on desktop/tablet */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between px-6 py-2 bg-gray-100 rounded-sm">
          <div className="flex gap-4">
            <Link href="/" className="text-yellow-500 font-semibold">Home <span className="fa-solid fa-chevron-down text-xs ml-1"></span></Link>
            <Link href="#" className="hover:text-yellow-500">Shop <span className="fa-solid fa-chevron-down text-xs ml-1"></span></Link>
            <Link href="/about" className="hover:text-yellow-500">About</Link>
            <Link href="/faq" className="hover:text-yellow-500">FAQ</Link>
            <Link href="#" className="hover:text-yellow-500">Contact</Link>
          </div>
          <span className="text-red-600 font-semibold flex items-center gap-2"><span className="fa-solid fa-percent"></span> Weekly Discount 30%!</span>
          <span className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold flex items-center gap-2"><span className="fa-solid fa-phone"></span> Hotline Number: +62812 3456 7890</span>
        </div>
      </div>
    </>
  );
}