"use client";

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '../store/cart';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sizes: string[];
  imageUrl?: string;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialCollection = searchParams.get('collection') || '';

  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(!!initialCategory || !!initialCollection);

  // Update filters if URL params change
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialCollection) setSelectedCollection(initialCollection);
    if (initialCategory || initialCollection) setShowFilters(true);
  }, [initialCategory, initialCollection]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (selectedCollection) params.append('collection', selectedCollection);
      if (selectedCategory) params.append('category', selectedCategory);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      
      if (data && data.items) {
        setProducts(data.items);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCollection, selectedCategory]);

  useEffect(() => {
    // Fetch collections once
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => setCollections(data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleAddToCart = (productId: string) => {
    addItem(productId, 'M');
    alert('Item added to cart!');
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCollection('');
    setSelectedCategory('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider text-luxury-brown font-serif">The Collection</h1>
        <p className="text-luxury-brown/70 text-lg max-w-2xl mx-auto font-light">
          Meticulously crafted for those who seek distinction in every thread.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-luxury-brown/10 pb-8">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-brown/40" />
            <input
              type="text"
              placeholder="Search pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-luxury-cream/10 border border-luxury-brown/10 focus:border-luxury-red outline-none transition-colors uppercase text-xs tracking-widest"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 border transition-all uppercase text-xs tracking-widest ${
                showFilters || selectedCollection || selectedCategory
                  ? 'bg-luxury-brown text-luxury-cream border-luxury-brown'
                  : 'bg-transparent text-luxury-brown border-luxury-brown/20 hover:border-luxury-brown'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {(selectedCollection || selectedCategory) && (
                <span className="ml-1 bg-luxury-red text-white w-2 h-2 rounded-full"></span>
              )}
            </button>
            
            {(search || selectedCollection || selectedCategory) && (
              <button 
                onClick={clearFilters}
                className="text-luxury-brown/50 hover:text-luxury-red transition-colors uppercase text-[10px] tracking-tighter"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-luxury-brown/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-brown/50 mb-4 font-bold">Collections</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCollection('')}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                    selectedCollection === '' ? 'bg-luxury-red text-white border-luxury-red' : 'border-luxury-brown/10 hover:border-luxury-brown'
                  }`}
                >
                  All Collections
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.slug)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                      selectedCollection === col.slug ? 'bg-luxury-red text-white border-luxury-red' : 'border-luxury-brown/10 hover:border-luxury-brown'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-brown/50 mb-4 font-bold">Category</label>
              <div className="flex flex-wrap gap-2">
                {['', 'tees', 'hoodies', 'outerwear', 'accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                      selectedCategory === cat ? 'bg-luxury-red text-white border-luxury-red' : 'border-luxury-brown/10 hover:border-luxury-brown'
                    }`}
                  >
                    {cat === '' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status messages */}
      {loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Discovering pieces...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-32 border border-luxury-red/10 bg-luxury-red/5">
          <p className="text-luxury-red text-xs uppercase tracking-widest mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="text-luxury-brown underline uppercase tracking-[0.2em] text-[10px] hover:text-luxury-red transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product grid */}
      {!error && (
        <>
          {products.length === 0 && !loading ? (
            <div className="text-center py-32 border border-luxury-brown/5">
              <XMarkIcon className="h-8 w-8 mx-auto text-luxury-brown/20 mb-4" />
              <p className="text-luxury-brown/40 uppercase tracking-[0.2em] text-xs">No pieces found matching your criteria</p>
              <button onClick={clearFilters} className="mt-6 text-luxury-red uppercase tracking-widest text-[10px] hover:underline">Clear Filters</button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col"
                >
                  <Link href={`/products/${product.id}`} className="relative aspect-[3/4] bg-luxury-cream/20 overflow-hidden mb-6 block">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-luxury-brown/20">
                        Image Pending
                      </div>
                    )}
                    <div className="absolute inset-0 bg-luxury-brown/0 group-hover:bg-luxury-brown/5 transition-colors duration-500"></div>
                  </Link>
                  
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] text-luxury-red uppercase tracking-[0.2em] font-bold">{product.category}</p>
                      <span className="text-sm font-light text-luxury-brown">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <h3 className="text-lg font-serif mb-3 group-hover:text-luxury-red transition-colors duration-300">
                      <Link href={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    
                    <p className="text-luxury-brown/60 text-xs font-light leading-relaxed mb-6 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-luxury-brown/5">
                      <div className="flex gap-2">
                        {product.sizes.slice(0, 3).map(size => (
                          <span key={size} className="text-[9px] uppercase tracking-tighter text-luxury-brown/40 border border-luxury-brown/10 px-1.5 py-0.5">{size}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="flex items-center gap-2 text-luxury-brown hover:text-luxury-red transition-colors uppercase text-[10px] tracking-[0.2em] font-bold"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Syncing Collection...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
