"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
};

type Collection = {
  id: string;
  name: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tees');
  const [imageUrl, setImageUrl] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(()=>{
    load();
    fetch('/api/collections').then(r=>r.json()).then(setCollections).catch(()=>setCollections([]));
  }, []);

  async function load() {
    const res = await fetch('/api/products');
    const j = await res.json();
    if (j.items) setProducts(j.items); else if (Array.isArray(j)) setProducts(j); else setProducts(j.products||[]);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function create() {
    if (!name || !price) return alert('Name and Price are required');
    setCreating(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/products', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: token ? `Bearer ${token}` : '' 
      }, 
      body: JSON.stringify({ 
        name, 
        price: parseFloat(price), 
        category, 
        sizes: ['S', 'M', 'L', 'XL'], 
        imageUrl: imageUrl || '/images/placeholder.jpg', 
        description, 
        inStock: true, 
        features: [], 
        collectionIds: selected 
      }) 
    });
    const json = await res.json();
    setCreating(false);
    if (res.ok) { 
      alert('Created'); 
      setName(''); 
      setPrice(''); 
      setDescription('');
      setImageUrl('');
      setSelected([]); 
      load(); 
    } else alert(json.error || 'Create failed');
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Add and manage your luxury pieces</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">← Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Active Products</h2>
            </div>
            <div className="divide-y">
              {products.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No products found</div>
              ) : products.map(p=> (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {/* We'd show real image here if available in the list view */}
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 uppercase font-bold">Piece</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500 font-mono">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-white hover:border-black transition-all">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Create New Piece</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Product Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Midnight Oversized Tee" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Price (USD)</label>
                  <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="250.00" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Category</label>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm appearance-none">
                    <option value="tees">Tees</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe the piece..." rows={3} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors text-sm resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Product Image</label>
                <div className="mt-1 flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  {imageUrl ? (
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden group">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={()=>setImageUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest">Remove</button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">{uploading ? 'Uploading...' : 'Upload product shot'}</div>
                      <input type="file" onChange={handleUpload} disabled={uploading} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>

              <div className="py-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Add to Collections</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {collections.map(c => (
                    <label key={c.id} className="flex items-center group cursor-pointer">
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={(e)=>{ if(e.target.checked) setSelected(s=>[...s,c.id]); else setSelected(s=>s.filter(x=>x!==c.id)) }} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-black transition-colors">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={create} 
                disabled={creating || uploading}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-900 disabled:bg-gray-300 transition-all shadow-lg shadow-black/5 mt-4"
              >
                {creating ? 'Creating Piece...' : 'Add to Collection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
