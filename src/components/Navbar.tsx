import Image from "next/image";
import { fetchCategories } from '../services/shopServices';
import { Category } from '../types/type';
import Link from "next/link";
import NavbarSearch from './NavbarSearch';

export default async function Navbar() {
  const categories: Category[] = await fetchCategories();
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
              <span className="fa-solid fa-user text-gray-500 text-xl"></span>
              <span className="fa-solid fa-heart text-gray-500 text-xl"></span>
              <Link href="/cart">
                <span className="fa-solid fa-basket-shopping text-gray-500 text-xl hover:text-orange-400"></span>
              </Link>
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