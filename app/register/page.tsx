"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '../store/user';
import { UserIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        setUser(data.user, data.token);
        router.push('/products');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during identity creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-luxury-brown mb-4 uppercase tracking-[0.2em]">New Identity</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Join the exclusive SPACE 404 ecosystem</p>
      </div>

      <div className="bg-white border border-luxury-brown/10 p-10 shadow-2xl shadow-luxury-brown/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-3 font-bold">Full Name</label>
            <div className="relative">
              <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-brown/20" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 pl-12 text-xs outline-none focus:border-luxury-red transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-3 font-bold">Email Identity</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-brown/20" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vault@identity.com"
                className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 pl-12 text-xs outline-none focus:border-luxury-red transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-luxury-brown/40 mb-3 font-bold">Secure Protocol (Password)</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-brown/20" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-luxury-cream/5 border border-luxury-brown/10 p-4 pl-12 text-xs outline-none focus:border-luxury-red transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-luxury-red/5 p-4 border border-luxury-red/10">
              <p className="text-[10px] text-luxury-red uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-brown text-luxury-cream py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-red transition-all duration-300 disabled:opacity-50 shadow-xl shadow-luxury-brown/10"
          >
            {loading ? 'Processing...' : 'Establish Identity'}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-luxury-brown/5 text-center">
          <p className="text-[10px] text-luxury-brown/40 uppercase tracking-widest mb-4">Already established?</p>
          <Link
            href="/login"
            className="text-luxury-red font-bold uppercase tracking-widest text-[10px] hover:underline"
          >
            Authorize Access
          </Link>
        </div>
      </div>
    </div>
  );
}
