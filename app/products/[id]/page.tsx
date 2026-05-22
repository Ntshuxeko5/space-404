"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '../../store/cart';
import { ChevronLeftIcon, SparklesIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  sizes: string[];
  features?: string[];
  imageUrl?: string;
  category?: string;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem) as (id: string, size: string) => void;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?id=${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Revealing the piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-2xl font-serif text-luxury-brown mb-6">Piece Not Found</h1>
        <Link href="/products" className="text-luxury-red uppercase tracking-widest text-xs hover:underline">Return to Collection</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size to continue');
      return;
    }
    addItem(product.id, selectedSize);
    alert(`${product.name} added to your bag`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <Link href="/products" className="inline-flex items-center gap-2 text-luxury-brown/40 hover:text-luxury-red transition-colors text-[10px] uppercase tracking-[0.2em] mb-12">
        <ChevronLeftIcon className="h-3 w-3" />
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        {/* Product image */}
        <div className="relative aspect-[3/4] bg-luxury-cream/20 overflow-hidden group">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.name}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-luxury-brown/20">
              Imagery Pending
            </div>
          )}
          <div className="absolute top-6 right-6">
            <span className="bg-white/80 backdrop-blur-sm px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-luxury-brown font-bold border border-luxury-brown/10">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-col">
          <div className="mb-10 pb-10 border-b border-luxury-brown/10">
            <h1 className="text-4xl lg:text-5xl font-serif text-luxury-brown mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-luxury-brown mb-8">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-luxury-brown/70 text-sm font-light leading-relaxed max-w-lg">
              {product.description}
            </p>
          </div>

          {/* Size selector */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-luxury-brown font-bold">Select Size</h3>
              <button className="text-[9px] uppercase tracking-widest text-luxury-brown/40 hover:text-luxury-red transition-colors">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  className={`w-14 h-14 flex items-center justify-center text-xs transition-all duration-300 border ${
                    selectedSize === size
                      ? 'border-luxury-brown bg-luxury-brown text-luxury-cream'
                      : 'border-luxury-brown/10 hover:border-luxury-brown text-luxury-brown'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-luxury-brown text-luxury-cream py-6 px-10 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-red transition-all duration-500 shadow-2xl shadow-luxury-brown/20 mb-12"
          >
            Add to Bag
          </button>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-luxury-brown/10">
            <div className="flex flex-col items-center text-center">
              <SparklesIcon className="h-5 w-5 text-luxury-red mb-3" />
              <p className="text-[9px] uppercase tracking-widest text-luxury-brown/60">Limited Release</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <TruckIcon className="h-5 w-5 text-luxury-red mb-3" />
              <p className="text-[9px] uppercase tracking-widest text-luxury-brown/60">Global Express</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheckIcon className="h-5 w-5 text-luxury-red mb-3" />
              <p className="text-[9px] uppercase tracking-widest text-luxury-brown/60">Secure Checkout</p>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-16 bg-luxury-cream/5 p-8 border border-luxury-brown/5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-luxury-brown font-bold mb-6">Product Details</h3>
              <ul className="space-y-4">
                {product.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-3 text-[11px] text-luxury-brown/70 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-red mt-1.5 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}