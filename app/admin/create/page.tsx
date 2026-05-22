'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, price: parseFloat(price), description, imageUrl: '/products/placeholder.jpg', category: 'Cosmic Casual', sizes: ['S','M','L'], features: [], inStock: true }) });
    const data = await res.json();
    if (data.id) router.push('/admin/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-3 border rounded" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full p-3 border rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-3 border rounded"></textarea>
        <button className="w-full bg-luxury-red text-luxury-cream py-3 rounded">Create</button>
      </form>
    </div>
  );
}