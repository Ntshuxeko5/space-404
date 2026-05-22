"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '../store/user';
import { 
  ShoppingBagIcon, 
  ChevronRightIcon, 
  ArrowRightOnRectangleIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch {
        console.error('Failed to fetch acquisitions');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-luxury-brown/10 pb-12">
        <div>
          <h1 className="text-4xl font-serif text-luxury-brown mb-2 uppercase tracking-widest">Client Profile</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/40">Established {new Date(user.id ? parseInt(user.id.substring(0, 8), 16) * 1000 : Date.now()).toLocaleDateString()}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-luxury-brown font-bold">{user.name}</p>
            <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40">{user.email}</p>
          </div>
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-2 px-6 py-3 border border-luxury-red/20 text-luxury-red hover:bg-luxury-red hover:text-white transition-all uppercase text-[9px] tracking-widest font-bold"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Terminate Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-luxury-cream/5 border border-luxury-brown/10 p-10 space-y-12">
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-6 border-b border-luxury-brown/10 pb-4">Personal Vault</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-luxury-brown/60">
                  <IdentificationIcon className="h-5 w-5" />
                  <span className="text-xs font-light">{user.name || 'Anonymous Client'}</span>
                </div>
                <div className="flex items-center gap-4 text-luxury-brown/60">
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="text-xs font-light">{orders.length} Total Acquisitions</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-brown mb-6 border-b border-luxury-brown/10 pb-4">Security</h3>
              <button className="text-[10px] uppercase tracking-widest text-luxury-brown/40 hover:text-luxury-red transition-colors font-bold">Modify Access Protocol</button>
            </section>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-8">
          <h2 className="text-xl font-serif text-luxury-brown mb-8">Acquisition History</h2>
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center border border-dashed border-luxury-brown/10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-red mb-4"></div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-brown/20">Syncing manifest...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center border border-dashed border-luxury-brown/20 bg-luxury-cream/5 text-center px-6">
              <ShoppingBagIcon className="h-12 w-12 text-luxury-brown/10 mb-6" />
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-brown/40 mb-8">No pieces discovered in your collection yet.</p>
              <Link href="/products" className="bg-luxury-brown text-luxury-cream px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-luxury-red transition-all shadow-xl shadow-luxury-brown/10">
                Begin Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="group bg-white border border-luxury-brown/10 p-8 hover:border-luxury-brown transition-all">
                  <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 pb-6 border-b border-luxury-brown/5">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40 mb-1">Acquisition ID</p>
                      <p className="text-xs font-mono font-bold">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40 mb-1">Status</p>
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 border ${
                        order.paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {order.paid ? 'Secured' : 'Pending Verification'}
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40 mb-1">Total Value</p>
                      <p className="text-sm font-bold text-luxury-brown">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-10 bg-luxury-cream/20 flex-shrink-0"></div>
                          <div>
                            <p className="text-xs font-medium text-luxury-brown">{item.productId}</p>
                            <p className="text-[9px] uppercase tracking-widest text-luxury-brown/40 mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-xs text-luxury-brown/60">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-luxury-brown/5 flex justify-end">
                    <Link 
                      href={`/order/confirmation?id=${order.id}&email=${order.customerEmail || user.email}`}
                      className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-luxury-brown/40 hover:text-luxury-red transition-colors"
                    >
                      View Full Manifest
                      <ChevronRightIcon className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
