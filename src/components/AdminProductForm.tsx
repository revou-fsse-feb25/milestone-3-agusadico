'use client';
import { useState, FormEvent, ChangeEvent } from 'react';

type Category = {
  id: number;
  name: string;
  image: string;
};

interface FormData {
  title: string;
  price: string;
  category: string;
  images: string[];
  description: string;
}

interface AdminProductFormProps {
  form: FormData;
  categories: Category[];
  editingId: string | null;
  loading: boolean;
  onSubmit: (e: FormEvent) => Promise<void>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  onImageChange: (value: string) => void;
}

export default function AdminProductForm({
  form,
  categories,
  editingId,
  loading,
  onSubmit,
  onChange,
  onCancel,
  onImageChange
}: AdminProductFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          name="title" 
          value={form.title} 
          onChange={onChange} 
          placeholder="Title" 
          className="border rounded p-2" 
          required 
        />
        <input 
          name="price" 
          value={form.price} 
          onChange={onChange} 
          placeholder="Price" 
          type="number" 
          step="0.01"
          min="0.01"
          className="border rounded p-2" 
          required 
        />
        <div className="relative">
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">Choose a category from the list</div>
        </div>
        <input 
          name="images" 
          value={Array.isArray(form.images) && form.images.length > 0 ? form.images[0] : ''} 
          onChange={(e) => onImageChange(e.target.value)} 
          placeholder="Image URL" 
          type="url"
          className="border rounded p-2 md:col-span-2" 
        />
        <textarea 
          name="description" 
          value={form.description} 
          onChange={onChange} 
          placeholder="Description" 
          className="border rounded p-2 md:col-span-2" 
          rows={3} 
        />
        <div className="md:col-span-2 flex gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-yellow-400 hover:bg-orange-400 disabled:bg-blue-400 text-black px-4 py-2 rounded"
          >
            {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')} Product
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 disabled:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}