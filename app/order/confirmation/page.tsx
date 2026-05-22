"use client";

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

function OrderConfirmationContent() {
  const search = useSearchParams();
  const qOrderId = search.get('id') || '';
  const qEmail = search.get('email') || '';

  const [orderId, setOrderId] = useState(qOrderId);
  const [email, setEmail] = useState(qEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const lookupOrder = useCallback(async (id = orderId, mail = email) => {
    setError(null);
    if (!id || !mail) return setError('Identity verification required');

    try {
      setLoading(true);
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}&email=${encodeURIComponent(mail)}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error || `Vault retrieval failed`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Lookup failed');
      setLoading(false);
    }
  }, [orderId, email]);

  useEffect(() => {
    if (qOrderId && qEmail) {
      lookupOrder(qOrderId, qEmail);
    }
  }, [qOrderId, qEmail, lookupOrder]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      {order && order.paid ? (
        <div className="text-center mb-16 animate-in fade-in zoom-in duration-700">
          <CheckCircleIcon className="h-20 w-20 text-luxury-red mx-auto mb-6" />
          <h1 className="text-4xl font-serif text-luxury-brown mb-4">Identity Secured</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Your order has been verified and is being prepared.</p>
        </div>
      ) : (
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-luxury-brown mb-4">Order Manifest</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Track the status of your exclusive acquisition.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <div className="bg-luxury-cream/5 border border-luxury-brown/10 p-10">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-luxury-brown mb-8 border-b border-luxury-brown/10 pb-4 flex items-center gap-2">
              <MagnifyingGlassIcon className="h-4 w-4" />
              Manifest Lookup
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-2">Order ID</label>
                <input 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  className="w-full bg-white border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors"
                  placeholder="e.g. 550e8400-e29b..."
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-2">Email Address</label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white border border-luxury-brown/10 p-4 text-xs outline-none focus:border-luxury-red transition-colors"
                  placeholder="identity@vault.com"
                />
              </div>
              <button 
                onClick={() => lookupOrder()} 
                disabled={loading} 
                className="w-full bg-luxury-brown text-luxury-cream py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-red transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Retrieving...' : 'Lookup Manifest'}
              </button>
              {error && <p className="text-[9px] text-luxury-red uppercase tracking-widest text-center mt-4">{error}</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {order ? (
            <div className="border border-luxury-brown/10 p-10 bg-white">
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-luxury-brown/10">
                <div>
                  <h2 className="text-xl font-serif text-luxury-brown mb-1">Acquisition #{order.id.slice(0,8)}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-luxury-brown/40">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold border ${
                  order.paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {order.paid ? 'Payment Verified' : 'Pending Verification'}
                </div>
              </div>

              <div className="space-y-6 mb-12">
                {order.items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-luxury-brown font-medium">{it.productId}</p>
                      <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40 mt-1">Size: {it.size || '—'} · Qty: {it.quantity}</p>
                    </div>
                    <p className="text-luxury-brown font-light">${(it.price * it.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-luxury-brown/10 pt-6 space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <p className="text-luxury-brown/40">Acquisition Total</p>
                  <p className="text-luxury-brown font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-6">
                <p className="text-[9px] text-center text-luxury-brown/40 uppercase tracking-[0.2em] leading-relaxed">
                  A confirmation email has been dispatched to {order.customerEmail || 'your registered address'}.<br />
                  For inquiries, please reference your unique acquisition ID.
                </p>
                <Link href="/products" className="text-luxury-red uppercase tracking-widest text-[10px] hover:underline font-bold">
                  Continue Exploration
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-luxury-brown/20 rounded-lg flex flex-col items-center justify-center p-12 text-center">
              <ShoppingBagIcon className="h-12 w-12 text-luxury-brown/10 mb-6" />
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-brown/30">
                Manifest data will appear here after identity verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Securing manifestation...</p>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
