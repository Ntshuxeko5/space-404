"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function PaymentReturnContent() {
  const search = useSearchParams();
  const router = useRouter();
  const reference = search.get('reference') || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!reference) {
      setError('Identity manifest missing');
      return;
    }
    verify();
  }, [reference]);

  async function verify() {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/verify', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ reference }) 
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Verification protocol failed');
        setLoading(false);
        return;
      }
      setOrder(data.order);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError('Verification connection error');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4">Payment Verification</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Securing your acquisition details</p>
      </div>

      <div className="max-w-md mx-auto">
        {loading && (
          <div className="text-center py-12 border border-luxury-brown/10 bg-luxury-cream/5">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mx-auto mb-4"></div>
            <p className="text-[10px] uppercase tracking-widest text-luxury-brown/40">Verifying transaction...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 border border-luxury-red/10 bg-luxury-red/5">
            <XCircleIcon className="h-12 w-12 text-luxury-red mx-auto mb-6" />
            <p className="text-[10px] text-luxury-red uppercase tracking-widest mb-6">{error}</p>
            <Link href="/cart" className="text-luxury-brown underline uppercase tracking-widest text-[10px] font-bold">Return to Bag</Link>
          </div>
        )}

        {order && (
          <div className="bg-white border border-luxury-brown/10 p-10 shadow-2xl shadow-luxury-brown/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {order.paid ? (
              <div className="text-center mb-10">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-serif text-luxury-brown">Payment Secured</h2>
              </div>
            ) : (
              <div className="text-center mb-10">
                <XCircleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl font-serif text-luxury-brown">Payment Pending</h2>
              </div>
            )}

            <div className="space-y-4 mb-10 pb-10 border-b border-luxury-brown/10">
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-luxury-brown/40">Acquisition ID</span>
                <span className="text-luxury-brown font-bold">#{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-luxury-brown/40">Status</span>
                <span className={`font-bold ${order.paid ? 'text-green-600' : 'text-orange-500'}`}>
                  {order.paid ? 'Confirmed' : 'Pending Verification'}
                </span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-luxury-brown/40">Amount</span>
                <span className="text-luxury-brown font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link 
                href={`/order/confirmation?id=${order.id}&email=${order.customerEmail || ''}`}
                className="w-full bg-luxury-brown text-luxury-cream py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-center hover:bg-luxury-red transition-all duration-300 shadow-lg shadow-luxury-brown/10"
              >
                View Manifest Details
              </Link>
              <Link 
                href="/products"
                className="w-full border border-luxury-brown/10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-center text-luxury-brown hover:border-luxury-brown transition-all duration-300"
              >
                Continue Exploration
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Connecting to Gateway...</p>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}
