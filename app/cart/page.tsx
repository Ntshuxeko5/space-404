'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/cart';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
};

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('token');

  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setFetching(false);
        return;
      }
      try {
        const productIds = Array.from(new Set(items.map(it => it.productId)));
        const fetchedProducts: Record<string, Product> = {};
        
        // Fetch products one by one or via a batch API if available
        // Our current /api/products handles id search
        for (const id of productIds) {
          const res = await fetch(`/api/products?id=${id}`);
          if (res.ok) {
            const data = await res.json();
            fetchedProducts[id] = data;
          }
        }
        setCartProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch cart products', err);
      } finally {
        setFetching(false);
      }
    }
    fetchCartProducts();
  }, [items]);

  function validateEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  const subtotal = items.reduce(
    (sum, item) => {
      const product = cartProducts[item.productId];
      return sum + (product ? product.price * item.quantity : 0);
    },
    0
  );

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = subtotal + shipping;

  if (fetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Reviewing your selection...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-md mx-auto border border-luxury-brown/10 p-12 bg-luxury-cream/5">
          <ShoppingBagIcon className="h-12 w-12 mx-auto text-luxury-brown/20 mb-6" />
          <h1 className="text-2xl font-serif mb-4 text-luxury-brown">Your Bag is Empty</h1>
          <p className="text-luxury-brown/50 text-xs uppercase tracking-widest mb-10 leading-relaxed">
            The most exclusive pieces await your discovery.
          </p>
          <Link
            href="/products"
            className="inline-block bg-luxury-brown text-luxury-cream px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-luxury-red transition-all duration-300 shadow-xl shadow-luxury-brown/10"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-2">Shopping Bag</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Confirm your selection before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <div className="space-y-10">
            {items.map((item) => {
              const product = cartProducts[item.productId];
              if (!product) return null;
              
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pb-10 border-b border-luxury-brown/10 group"
                >
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0 w-32 aspect-[3/4] bg-luxury-cream/20 overflow-hidden relative">
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-widest text-luxury-brown/20">Pending</div>
                    )}
                  </Link>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
                    <div>
                      <p className="text-[10px] text-luxury-red uppercase tracking-[0.2em] font-bold mb-1">{product.category}</p>
                      <h3 className="text-xl font-serif text-luxury-brown mb-2 hover:text-luxury-red transition-colors">
                        <Link href={`/products/${item.productId}`}>{product.name}</Link>
                      </h3>
                      <p className="text-[10px] text-luxury-brown/50 uppercase tracking-widest">Size: <span className="text-luxury-brown font-bold ml-1">{item.size}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-8 justify-between sm:justify-end">
                      <div className="flex items-center border border-luxury-brown/10">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-luxury-brown hover:bg-luxury-brown hover:text-luxury-cream transition-colors"
                        >-</button>
                        <span className="px-4 text-xs font-bold text-luxury-brown">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-3 py-1 text-luxury-brown hover:bg-luxury-brown hover:text-luxury-cream transition-colors"
                        >+</button>
                      </div>
                      
                      <p className="text-lg font-light text-luxury-brown w-24 text-right">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                      
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-luxury-brown/30 hover:text-luxury-red transition-colors p-2"
                        title="Remove piece"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-luxury-cream/5 border border-luxury-brown/10 p-10 sticky top-32">
            <h2 className="text-xl font-serif text-luxury-brown mb-8 pb-4 border-b border-luxury-brown/10">Order Summary</h2>
            <div className="space-y-6">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <p className="text-luxury-brown/50">Subtotal</p>
                <p className="text-luxury-brown font-bold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <p className="text-luxury-brown/50">Shipping</p>
                <p className="text-luxury-brown font-bold">
                  {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                </p>
              </div>
              <div className="border-t border-luxury-brown/10 pt-6">
                <div className="flex justify-between mb-10">
                  <p className="text-lg font-serif text-luxury-brown">Total</p>
                  <p className="text-2xl font-light text-luxury-brown">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {!isAuthenticated && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-brown/50 mb-3 font-bold">
                      Email for Order Details
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vault@identity.com"
                      className="w-full bg-white border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors"
                    />
                  </div>
                )}

                {error && (
                  <div className="bg-luxury-red/5 p-4 border border-luxury-red/10">
                    <p className="text-[10px] text-luxury-red uppercase tracking-widest text-center">{error}</p>
                  </div>
                )}

                <button
                  onClick={async () => {
                    setError(null);
                    if (!isAuthenticated && !validateEmail(email)) {
                      setError('A valid identity (email) is required');
                      return;
                    }
                    try {
                      setLoading(true);
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      
                      const res = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
                        body: JSON.stringify({ items: items, total, customerEmail: isAuthenticated ? undefined : email }),
                      });
                      const order = await res.json();
                      if (!order.id) throw new Error(order.error || 'Order creation failed');

                      const emailForPayment = isAuthenticated ? (order.customerEmail || '') : email;
                      const payRes = await fetch('/api/payments/initiate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id, email: emailForPayment, amount: total }),
                      });
                      const payData = await payRes.json();
                      if (payData.authorization_url) {
                        window.location.href = payData.authorization_url;
                      } else {
                        setError('Gateway unavailable. Please try again.');
                        setLoading(false);
                      }
                    } catch (err: any) {
                      console.error(err);
                      setError(err.message || 'Checkout failed');
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-luxury-brown text-luxury-cream py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-red transition-all duration-300 disabled:opacity-50 shadow-xl shadow-luxury-brown/10"
                >
                  {loading ? 'Processing...' : 'Secure Checkout'}
                </button>
                
                <p className="text-[9px] text-center text-luxury-brown/40 uppercase tracking-widest leading-relaxed">
                  Payments secured via Paystack.<br />Global delivery within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}