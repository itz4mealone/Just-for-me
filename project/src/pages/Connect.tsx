import React, { useState, useEffect } from 'react';
import { Music, Book, Map, Heart, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Item {
  id: string;
  title: string;
  description: string;
  type: 'playlist' | 'book' | 'adventure';
  link?: string;
}

export default function Connect() {
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    type: 'playlist',
    title: '',
    description: '',
    link: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('connection_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      return;
    }

    setItems(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('connection_items')
      .insert([newItem]);

    if (error) {
      console.error('Error adding item:', error);
      return;
    }

    setNewItem({ type: 'playlist', title: '', description: '', link: '' });
    setShowForm(false);
    fetchItems();
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'playlist': return Music;
      case 'book': return Book;
      case 'adventure': return Map;
      default: return Heart;
    }
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair text-gray-800 mb-4">Let's Connect</h1>
          <p className="text-gray-600">Our shared dreams and favorite things</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mb-8 mx-auto flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Item</span>
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Item</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as Item['type'] })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="playlist">Playlist</option>
                    <option value="book">Book</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Link (optional)</label>
                  <input
                    type="url"
                    value={newItem.link}
                    onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-md text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Icon className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    <span>Explore</span>
                    <Heart className="h-4 w-4 ml-2" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}