"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductEdit() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{
    if (!id) return;
    Promise.all([
      fetch('/api/collections').then(r=>r.json()),
      fetch(`/api/products?id=${id}`).then(r=>r.json())
    ]).then(([cols, p]) => {
      setCollections(cols || []);
      setProduct(p);
      setSelected((p.productCollections||[]).map((pc:any)=>pc.collectionId));
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

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
        setProduct((p: any) => ({ ...p, imageUrl: data.url }));
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

  async function save() {
    setSaving(true);
    const token = localStorage.getItem('token');
    const sizes = Array.isArray(product.sizes) 
      ? product.sizes 
      : (typeof product.sizes === 'string' 
          ? product.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean) 
          : []);
    
    const body = { 
      id, 
      name: product.name, 
      price: product.price, 
      category: product.category, 
      sizes, 
      inStock: !!product.inStock, 
      description: product.description, 
      imageUrl: product.imageUrl, 
      collectionIds: selected 
    };

    try {
      const res = await fetch('/api/products', { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: token ? `Bearer ${token}` : '' 
        }, 
        body: JSON.stringify(body) 
      });
      const json = await res.json();
      if (res.ok) {
        alert('Piece updated successfully');
        setProduct(json);
      } else {
        alert(json.error || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400">Loading Piece Details...</p>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-sm uppercase tracking-widest text-red-500">Piece not found</p>
      <Link href="/admin/products" className="mt-4 text-xs underline">Back to Inventory</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Piece</h1>
          <p className="text-gray-500 mt-1">Modifying {product.name}</p>
        </div>
        <Link href="/admin/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">← Back to Inventory</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Image */}
        <div className="md:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Product Image</label>
          <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group">
            {product.imageUrl ? (
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">No Image</div>
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
                {uploading ? 'Uploading...' : 'Change Image'}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
              </label>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">Recommended: 1200x1600px<br />PNG or JPG format</p>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Piece Name</label>
              <input 
                value={product.name || ''} 
                onChange={(e)=>setProduct({...product, name:e.target.value})} 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price (USD)</label>
              <input 
                type="number" 
                step="0.01" 
                value={product.price || 0} 
                onChange={(e)=>setProduct({...product, price:parseFloat(e.target.value)})} 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
              <select 
                value={product.category || ''} 
                onChange={(e)=>setProduct({...product, category:e.target.value})} 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-colors appearance-none"
              >
                <option value="tees">Tees</option>
                <option value="hoodies">Hoodies</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
            <textarea 
              value={product.description || ''} 
              onChange={(e)=>setProduct({...product, description:e.target.value})} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-colors resize-none" 
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Availability</label>
              <label className="flex items-center cursor-pointer group">
                <div className={`w-12 h-6 rounded-full relative transition-colors ${product.inStock ? 'bg-black' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${product.inStock ? 'left-7' : 'left-1'}`}></div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={!!product.inStock} 
                  onChange={(e)=>setProduct({...product, inStock:e.target.checked})} 
                />
                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-black">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sizes (Comma separated)</label>
              <input 
                value={Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || '')} 
                onChange={(e)=>setProduct({...product, sizes:e.target.value})} 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
                placeholder="S, M, L, XL"
              />
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Collections</label>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {collections.map(c=> (
                <label key={c.id} className="flex items-center p-3 border border-gray-50 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selected.includes(c.id)} 
                    onChange={(e)=>{ 
                      if(e.target.checked) setSelected(s=>[...s,c.id]); 
                      else setSelected(s=>s.filter(x=>x!==c.id)) 
                    }} 
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={save} 
              disabled={saving || uploading}
              className="flex-grow py-4 bg-black text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg shadow-black/5"
            >
              {saving ? 'Saving Changes...' : 'Save Piece Details'}
            </button>
            <button 
              onClick={() => router.push('/admin/products')}
              className="px-8 py-4 border border-gray-200 text-gray-400 hover:text-black hover:border-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
