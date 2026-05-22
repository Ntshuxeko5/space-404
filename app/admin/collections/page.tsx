"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrashIcon, 
  PencilSquareIcon,
  ShoppingBagIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export default function AdminCollectionsPage() {
  const [cols, setCols] = useState<Collection[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => {
        setCols(data || []);
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);

  async function handleSubmit() {
    if (!name || !slug) return alert('Name and slug are required');
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, name, slug, description: desc } : { name, slug, description: desc };

    try {
      const res = await fetch('/api/collections', { 
        method, 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: token ? `Bearer ${token}` : '' 
        }, 
        body: JSON.stringify(body) 
      });
      const json = await res.json();
      
      if (res.ok) {
        if (editingId) {
          setCols(s => s.map(c => c.id === editingId ? json : c));
          setEditingId(null);
        } else {
          setCols(s => [json, ...s]);
        }
        setName(''); setSlug(''); setDesc('');
        alert(editingId ? 'Collection updated' : 'Collection created');
      } else {
        alert(json.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function deleteCollection(id: string) {
    if (!confirm('This will archive the collection. Continue?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/collections', { 
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: token ? `Bearer ${token}` : '' 
      }, 
      body: JSON.stringify({ id }) 
    });
    if (res.ok) {
      setCols((s) => s.filter((c) => c.id !== id));
    } else {
      const json = await res.json();
      alert(json.error || 'Delete failed');
    }
  }

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400">Loading Collections...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500 mt-1">Organize your drops and limited releases</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-2">
          <ChevronLeftIcon className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{editingId ? 'Edit Collection' : 'Create New Collection'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Collection Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Winter Archive 2026" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Slug (URL friendly)</label>
                <input value={slug} onChange={(e)=>setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="winter-archive" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
                <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="The story behind this drop..." rows={3} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm resize-none" />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-grow py-4 bg-black text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-900 disabled:bg-gray-300 transition-all shadow-lg shadow-black/5 mt-4"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Collection' : 'Create Collection'}
                </button>
                {editingId && (
                  <button 
                    onClick={() => { setEditingId(null); setName(''); setSlug(''); setDesc(''); }}
                    className="py-4 px-6 bg-white border border-gray-200 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:border-black transition-all mt-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Existing Collections</h2>
            </div>
            <div className="divide-y">
              {cols.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No collections discovered in the vault</div>
              ) : cols.map(c=> (
                <div key={c.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-luxury-red/5 rounded-full flex items-center justify-center text-luxury-red">
                      <ShoppingBagIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-tighter">/{c.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { 
                        setEditingId(c.id); 
                        setName(c.name); 
                        setSlug(c.slug); 
                        setDesc(c.description || ''); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                      title="Edit Collection"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteCollection(c.id)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Archive Collection"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
