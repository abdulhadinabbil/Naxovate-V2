import React, { useState } from 'react';
import { X, Share2, MessageCircle, Facebook, Instagram, Copy, Check, Download } from 'lucide-react';
import { downloadImageFromUrl, getShareableUrl, getDisplayUrl, getOriginalUrl } from '../utils/urlUtils';

interface ProfessionalShareModalProps {
  imageUrl: string;
  caption?: string;
  onClose: () => void;
}

const ProfessionalShareModal: React.FC<ProfessionalShareModalProps> = ({ 
  imageUrl, 
  caption = '', 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);
  const [customCaption, setCustomCaption] = useState(caption);
  const [downloading, setDownloading] = useState(false);

  // Use branded URL for display and copying
  const brandedUrl = getShareableUrl(imageUrl);
  const displayUrl = getDisplayUrl(imageUrl);
  // Use original URL for actual functionality (download, sharing)
  const originalUrl = getOriginalUrl(imageUrl);

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${customCaption}\n\nCheck out this AI-generated image from NaxoVate: ${brandedUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(brandedUrl);
    const quote = encodeURIComponent(`${customCaption} - Created with NaxoVate AI`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const shareToInstagram = () => {
    copyToClipboard();
    alert('Image URL copied! You can now save the image and share it on Instagram with your caption.');
  };

  const copyToClipboard = async () => {
    try {
      // Copy the branded URL instead of the Supabase URL
      await navigator.clipboard.writeText(brandedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `naxovate-ai-generated-${timestamp}.jpg`;
      
      // Use original URL for actual download functionality
      await downloadImageFromUrl(originalUrl, fileName);
    } catch (err: any) {
      console.error('Download failed:', err);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scroll">

        {/* Header */}
        {/* Sticky Header */}
<div className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
    src={originalUrl}
    alt="Generated"
    className="max-w-full max-h-96 object-contain rounded-lg"
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
                className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2 text-white" />
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
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Download className={`h-5 w-5 mr-2 ${downloading ? 'animate-spin' : ''}`} />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfessionalShareModal;