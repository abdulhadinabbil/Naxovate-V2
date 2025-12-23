import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Download, Trash2, Image as ImageIcon, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadImageFromUrl, getDisplayUrl, getOriginalUrl } from '../utils/urlUtils';
import ProfessionalShareModal from '../components/ProfessionalShareModal';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  created_at: string;
}

const GeneratedImagesPage = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [user]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) return;

      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setImages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      if (!user) return;

      const imageToDelete = images.find(img => img.id === imageId);
      if (!imageToDelete) return;

      // Delete from storage
      const urlParts = imageToDelete.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error: storageError } = await supabase.storage
        .from('generated_images')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      setDownloading(image.id);
      
      // Generate filename
      const timestamp = new Date(image.created_at).toISOString().replace(/[:.]/g, '-');
      const styleLabel = image.style.replace(/\s+/g, '-');
      const fileName = `naxovate-${styleLabel}-${timestamp}.jpg`;
      
      // Use original URL for download functionality
      await downloadImageFromUrl(getOriginalUrl(image.url), fileName);
    } catch (err: any) {
      setError('Failed to download image');
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = (image: GeneratedImage) => {
    setShareImage(image);
    setShowShareModal(true);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to view your generated images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Images</h1>
          <p className="text-gray-600 dark:text-gray-400">Your AI-generated image collection</p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Image Grid */}
          <div className={`${selectedImage ? 'w-full md:w-1/2 border-r border-gray-200 dark:border-gray-700' : 'w-full'}`}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="p-6 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No generated images yet</p>
                <Link
                  to="/ai-generator"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Generate Your First Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                      selectedImage?.id === image.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          disabled={downloading === image.id}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                          title="Download"
                        >
                          <Download className={`h-5 w-5 text-gray-700 ${downloading === image.id ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                          title="Share"
                        >
                          <Share2 className="h-5 w-5 text-green-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Details */}
          {selectedImage && (
            <div className="w-full md:w-1/2 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Details</h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mb-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Prompt</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedImage.prompt}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Style</h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{selectedImage.style}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Created</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedImage.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    disabled={downloading === selectedImage.id}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    <Download className={`h-5 w-5 mr-2 ${downloading === selectedImage.id ? 'animate-spin' : ''}`} />
                    {downloading === selectedImage.id ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && shareImage && (
        <ProfessionalShareModal
          imageUrl={shareImage.url}
          caption={shareImage.prompt}
          onClose={() => {
            setShowShareModal(false);
            setShareImage(null);
          }}
        />
      )}
    </div>
  );
};

export default GeneratedImagesPage;