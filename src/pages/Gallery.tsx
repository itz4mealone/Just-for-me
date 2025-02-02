import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Edit3, Trash2, FolderPlus, FolderMinus, Search, Move } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
  folder: string; // Add folder property
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newCaption, setNewCaption] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]); // State to manage selected photos
  const [folders, setFolders] = useState<string[]>([]); // State to manage folders
  const [currentFolder, setCurrentFolder] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    const uniqueFolders = [...new Set(photos.map(photo => photo.folder).filter(folder => folder))];
    setFolders(uniqueFolders);
  }, [photos]);

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
            folder: newFolder || currentFolder, // Assign folder to the photo
          },
        ]);

      if (dbError) throw dbError;

      setNewCaption('');
      setNewFolder('');
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateFolder() {
    if (!newFolder.trim()) return;

    setFolders([...folders, newFolder]);
    setNewFolder('');
  }

  async function handleDeleteFolder(folder: string) {
    const updatedPhotos = photos.map(photo => photo.folder === folder ? { ...photo, folder: '' } : photo);
    setPhotos(updatedPhotos);
    setFolders(folders.filter(f => f !== folder));
  }

  async function handleMoveToFolder(photoIds: string[], folder: string) {
    const { error } = await supabase
      .from('photos')
      .update({ folder })
      .in('id', photoIds);

    if (error) {
      console.error('Error moving photos to folder:', error);
      return;
    }

    fetchPhotos();
  }

  async function handleRenamePhoto(photo: Photo) {
    const { error } = await supabase
      .from('photos')
      .update({ caption: newName })
      .eq('id', photo.id);

    if (error) {
      console.error('Error renaming photo:', error);
      return;
    }

    setIsRenaming(false);
    setNewName('');
    fetchPhotos();
  }

  async function handleDeletePhoto(photo: Photo) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id);

    if (error) {
      console.error('Error deleting photo:', error);
      return;
    }

    fetchPhotos();
  }

  const filteredPhotos = photos.filter(photo => 
    photo.caption.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (currentFolder ? photo.folder === currentFolder : true)
  );

  function toggleSelectPhoto(photoId: string) {
    setSelectedPhotos(prevSelected => 
      prevSelected.includes(photoId) ? prevSelected.filter(id => id !== photoId) : [...prevSelected, photoId]
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-playfair text-gray-800 text-center mb-12">Our Memories</h1>
        
        <div className="mb-12 flex space-x-4">
          <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Folders</h2>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentFolder('')}
                className={`w-full py-2 px-4 text-left ${currentFolder === '' ? 'bg-rose-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All Photos
              </button>
              {folders.map((folder) => (
                <div key={folder} className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentFolder(folder)}
                    className={`flex-1 py-2 px-4 text-left ${currentFolder === folder ? 'bg-rose-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {folder}
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder)}
                    className="text-gray-500 hover:text-rose-500"
                  >
                    <FolderMinus className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="New folder..."
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button
                onClick={handleCreateFolder}
                className="w-full py-2 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600"
              >
                <FolderPlus className="inline-block mr-2" /> Create Folder
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
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

            <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by caption..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-12">
              <button
                onClick={() => handleMoveToFolder(selectedPhotos, currentFolder)}
                className="py-2 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                disabled={!selectedPhotos.length}
              >
                <Move className="inline-block mr-2" /> Move Selected to {currentFolder || 'Folder'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`group relative rounded-lg overflow-hidden shadow-lg opacity-0 animate-fade-in cursor-pointer ${selectedPhotos.includes(photo.id) ? 'border-4 border-rose-500' : ''}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => toggleSelectPhoto(photo.id)}
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
          </div>
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
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => setIsRenaming(true)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Edit3 className="inline-block mr-2" /> Rename
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(selectedPhoto)}
                      className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 className="inline-block mr-2" /> Delete
                    </button>
                    <select
                      onChange={(e) => handleMoveToFolder([selectedPhoto.id], e.target.value)}
                      className="py-2 px-4 border rounded-md"
                      value={selectedPhoto.folder}
                    >
                      <option value="">Move to folder</option>
                      {folders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isRenaming && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="New name..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                      <button
                        onClick={() => handleRenamePhoto(selectedPhoto)}
                        className="mt-2 w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}