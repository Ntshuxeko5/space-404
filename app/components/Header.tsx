"use client";

import Link from 'next/link';
import { ShoppingCartIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cart';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Tees', slug: 'tees' },
    { name: 'Hoodies', slug: 'hoodies' },
    { name: 'Outerwear', slug: 'outerwear' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-luxury-brown/95 backdrop-blur-md py-4' : 'bg-luxury-brown py-6'} text-luxury-cream border-b border-luxury-cream/10`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] hover:text-luxury-red transition-colors">
              SPACE 404
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-luxury-red transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-luxury-red transition-colors">
              The Collection
            </Link>
            
            <div className="relative group" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-luxury-red transition-colors">
                Categories
                <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full left-0 mt-2 w-48 bg-luxury-brown border border-luxury-cream/10 transition-all duration-300 ${showCategories ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="block px-6 py-3 text-[9px] uppercase tracking-widest hover:bg-luxury-cream/5 hover:text-luxury-red transition-colors"
                      onClick={() => setShowCategories(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="hidden sm:block p-2 hover:text-luxury-red transition-colors group relative">
              <UserIcon className="h-5 w-5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[8px] uppercase tracking-widest px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vault Control</span>
            </Link>
            
            <Link href="/cart" className="p-2 hover:text-luxury-red transition-colors relative">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-luxury-red text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}