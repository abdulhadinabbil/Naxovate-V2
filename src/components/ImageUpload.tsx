import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: string | null;
  onClearImage?: () => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  selectedImage, 
  onClearImage,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  if (selectedImage) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative group">
          <img
            src={selectedImage}
            alt="Selected for modification"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
            {onClearImage && (
              <button
                onClick={onClearImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                title="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          Image ready for AI modification
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || dragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <Upload className="h-12 w-12 text-indigo-500 mb-4 animate-bounce" />
              <p className="text-lg text-indigo-600 dark:text-indigo-400 mb-2 font-medium">
                Drop your image here
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Upload an image to modify
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Supports JPG, PNG, GIF, WebP
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;