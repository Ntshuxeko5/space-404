"use client";

import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/collections').then((r) => r.json()).then(setCols).catch(console.error);
  }, []);

  async function create() {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ name, slug, description: desc }) });
    const json = await res.json();
    if (res.ok) {
      setCols((s) => [json, ...s]);
      setName(''); setSlug(''); setDesc('');
    } else {
      alert(json.error || 'Create failed');
    }
    setLoading(false);
  }

  // updateCollection is not used in this simple admin UI. Use Edit to populate fields and have Create act as upsert.

  async function deleteCollection(id: string) {
    if (!confirm('Delete this collection?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/collections', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ id }) });
    const json = await res.json();
    if (res.ok) {
      setCols((s) => s.filter((c) => c.id !== id));
    } else alert(json.error || 'Delete failed');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="p-2 border" />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" className="p-2 border" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="description" className="p-2 border" />
      </div>
      <div className="mb-6">
        <button onClick={create} className="bg-black text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create Collection'}</button>
      </div>

      <div className="space-y-3">
        {cols.map((c) => (
          <div key={c.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <div className="font-medium">{c.name} <span className="text-sm text-gray-500">/{c.slug}</span></div>
              <div className="text-sm text-gray-600">{c.description}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => { setName(c.name); setSlug(c.slug); setDesc(c.description || ''); }} className="text-blue-600">Edit</button>
              <button onClick={() => deleteCollection(c.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
