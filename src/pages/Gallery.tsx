import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newCaption, setNewCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      return;
    }

    setPhotos(data || []);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!newCaption.trim()) {
      alert('Please add a caption for your memory');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('photos')
        .insert([
          {
            url: publicUrl,
            caption: newCaption,
          },
        ]);

      if (dbError) throw dbError;

      setNewCaption('');
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair text-gray-800 text-center mb-12">Our Memories</h1>
        
        <div className="mb-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add a New Memory</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Caption for this memory..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
              <label className="block">
                <span className="sr-only">Choose photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-rose-50 file:text-rose-700
                    hover:file:bg-rose-100"
                />
              </label>
              {uploading && (
                <p className="text-sm text-rose-500">Uploading your memory...</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative rounded-lg overflow-hidden shadow-lg opacity-0 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-xl font-semibold text-center px-4">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Full-screen photo view */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="max-w-7xl w-full relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white hover:text-rose-500 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full max-h-[80vh] object-contain"
                />
                <div className="p-4">
                  <p className="text-xl font-semibold text-gray-800">{selectedPhoto.caption}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}