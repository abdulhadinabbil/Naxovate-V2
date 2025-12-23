import React, { useState } from 'react';
import { X, Share2, MessageCircle, Facebook, Instagram, Copy, Check } from 'lucide-react';

interface SocialShareModalProps {
  imageUrl: string;
  caption?: string;
  onClose: () => void;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({ imageUrl, caption = '', onClose }) => {
  const [copied, setCopied] = useState(false);
  const [customCaption, setCustomCaption] = useState(caption);

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${customCaption}\n\nCheck out this AI-generated image: ${imageUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(imageUrl);
    const quote = encodeURIComponent(customCaption);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the image URL
    // Users can manually paste it in Instagram
    copyToClipboard();
    alert('Image URL copied! You can now paste it in Instagram or save the image to share.');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Image
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Image Preview */}
          <div className="mb-6">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Caption Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption (optional)
            </label>
            <textarea
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="Add a caption for your shared image..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <button
              onClick={shareToWhatsApp}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Share to WhatsApp
            </button>

            <button
              onClick={shareToFacebook}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Facebook className="h-5 w-5 mr-3" />
              Share to Facebook
            </button>

            <button
              onClick={shareToInstagram}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
            >
              <Instagram className="h-5 w-5 mr-3" />
              Share to Instagram
            </button>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy Link
                  </>
                )}
              </button>

              <button
                onClick={downloadImage}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Instagram tip:</strong> Since Instagram doesn't support direct URL sharing, 
              click "Share to Instagram\" to copy the image URL, then save the image to your device 
              and upload it manually to Instagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;