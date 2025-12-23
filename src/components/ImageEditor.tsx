import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Edit3, Download, Share2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ImageEditorProps {
  onImageEdited: (editedUrl: string) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onImageEdited, onClose }) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hue: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const applyFilters = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
      hue-rotate(${filters.hue}deg)
    `;

    ctx.drawImage(img, 0, 0);
    
    const editedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setEditedImage(editedDataUrl);
  };

  const saveEditedImage = async () => {
    if (!editedImage || !user) return;

    try {
      setLoading(true);

      // Convert base64 to blob
      const response = await fetch(editedImage);
      const blob = await response.blob();

      // Generate unique filename
      const fileName = `edited_${Date.now()}.jpg`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('edited_photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('edited_photos')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('edited_photos')
        .insert({
          user_id: user.id,
          original_url: selectedImage || '',
          edited_url: urlData.publicUrl,
          edit_history: filters,
        });

      if (dbError) throw dbError;

      onImageEdited(urlData.publicUrl);
      onClose();
    } catch (err: any) {
      console.error('Error saving edited image:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      hue: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Editor</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Image Upload/Preview */}
          <div className="flex-1 p-6 flex flex-col">
            {!selectedImage ? (
              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition ${
                  isDragActive 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {isDragActive ? 'Drop your image here' : 'Upload an image to edit'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag & drop or click to select
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center relative">
                <div className="max-w-full max-h-full overflow-hidden rounded-lg">
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                    style={{
                      filter: `
                        brightness(${filters.brightness}%)
                        contrast(${filters.contrast}%)
                        saturate(${filters.saturation}%)
                        blur(${filters.blur}px)
                        sepia(${filters.sepia}%)
                        grayscale(${filters.grayscale}%)
                        hue-rotate(${filters.hue}deg)
                      `
                    }}
                    onLoad={applyFilters}
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>

          {/* Controls */}
          {selectedImage && (
            <div className="w-80 p-6 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
              
              <div className="space-y-4">
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                      {key}: {value}{key === 'brightness' || key === 'contrast' || key === 'saturation' ? '%' : key === 'blur' ? 'px' : key === 'hue' ? '°' : '%'}
                    </label>
                    <input
                      type="range"
                      min={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 0 : key === 'blur' ? 0 : key === 'hue' ? -180 : 0}
                      max={key === 'brightness' || key === 'contrast' || key === 'saturation' ? 200 : key === 'blur' ? 10 : key === 'hue' ? 180 : 100}
                      value={value}
                      onChange={(e) => {
                        const newFilters = { ...filters, [key]: parseInt(e.target.value) };
                        setFilters(newFilters);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Reset
                </button>
                <button
                  onClick={saveEditedImage}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;