import React, { useState } from 'react';
import { ArrowLeftRight, Download, Share2, RotateCcw } from 'lucide-react';

interface ImageComparisonProps {
  originalImage: string;
  modifiedImage: string;
  onDownload: () => void;
  onShare: () => void;
  onReset: () => void;
  downloading?: boolean;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  modifiedImage,
  onDownload,
  onShare,
  onReset,
  downloading = false
}) => {
  const [showComparison, setShowComparison] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="space-y-6">
      {/* Toggle View */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Modified Result
        </h3>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          {showComparison ? 'Show Result Only' : 'Compare Images'}
        </button>
      </div>

      {/* Image Display */}
      {showComparison ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Original</h4>
            <div className="relative group">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Original
              </div>
            </div>
          </div>

          {/* Modified Image */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Modified</h4>
            <div className="relative group">
              <img
                src={modifiedImage}
                alt="Modified"
                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs">
                Modified
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Single Image View */
        <div className="relative">
          <img
            src={modifiedImage}
            alt="AI Modified Result"
            className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-600 mx-auto"
          />
          <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            AI Modified
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
        >
          <Download className={`h-4 w-4 mr-2 ${downloading ? 'animate-spin' : ''}`} />
          {downloading ? 'Downloading...' : 'Download'}
        </button>

        <button
          onClick={onShare}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </button>

        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Be specific in your prompts (e.g., "change background to sunset over mountains")</li>
          <li>• Use high-quality source images for better modifications</li>
          <li>• Try different styles and approaches if the first result isn't perfect</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageComparison;