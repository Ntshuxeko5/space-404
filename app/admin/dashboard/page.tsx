'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  TagIcon, 
  UsersIcon, 
  ArrowTrendingUpIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    collections: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function loadStats() {
      try {
        const [prodRes, colRes, orderRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/collections'),
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const products = await prodRes.json();
        const collections = await colRes.json();
        const orders = await orderRes.json();

        const items = Array.isArray(products) ? products : (products.items || []);
        const orderList = Array.isArray(orders) ? orders : [];
        
        setStats({
          products: items.length,
          collections: collections.length || 0,
          orders: orderList.length || 0,
          revenue: orderList.reduce((sum: number, o: any) => sum + (o.paid ? o.total : 0), 0)
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400">Securing Session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vault Control</h1>
          <p className="text-gray-500 mt-1">Manage your exclusive inventory and orders</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Terminate Session
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: ArrowTrendingUpIcon, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Pieces', value: stats.products, icon: TagIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Collections', value: stats.collections, icon: ShoppingBagIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Orders', value: stats.orders, icon: UsersIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Inventory Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/products" className="group p-8 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all flex flex-col justify-between aspect-video shadow-xl shadow-black/10">
              <TagIcon className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xl font-bold mb-1">Products</p>
                <p className="text-sm text-gray-400">View and edit your inventory</p>
              </div>
            </Link>
            <Link href="/admin/collections" className="group p-8 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all flex flex-col justify-between aspect-video shadow-sm">
              <ShoppingBagIcon className="h-8 w-8 text-gray-300 group-hover:text-black transition-colors" />
              <div>
                <p className="text-xl font-bold mb-1 text-gray-900">Collections</p>
                <p className="text-sm text-gray-500">Organize pieces into drops</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">System Actions</h2>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <Link href="/admin/products" className="w-full mb-3 flex items-center justify-center gap-2 bg-white border border-gray-200 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:border-black transition-all">
              <PlusIcon className="h-4 w-4" />
              New Piece
            </Link>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
              System v1.0.4<br />Identity Vault Secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}