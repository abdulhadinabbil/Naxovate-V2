import React, { useState } from 'react';
import { Wand2, Palette, Sparkles, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface ModificationOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'style' | 'edit' | 'enhance';
}

interface ImageModificationPanelProps {
  onModificationSelect: (type: string, prompt: string) => void;
  loading: boolean;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
}

const ImageModificationPanel: React.FC<ImageModificationPanelProps> = ({
  onModificationSelect,
  loading,
  customPrompt,
  onCustomPromptChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'style' | 'edit' | 'enhance' | 'custom'>('custom');

  const modificationOptions: ModificationOption[] = [
    {
      id: 'artistic',
      name: 'Artistic Style',
      description: 'Transform into artistic styles like painting, sketch, etc.',
      icon: Palette,
      category: 'style'
    },
    {
      id: 'enhance',
      name: 'Enhance Quality',
      description: 'Improve image quality, colors, and details',
      icon: Sparkles,
      category: 'enhance'
    },
    {
      id: 'modify',
      name: 'Modify Objects',
      description: 'Change, add, or remove objects in the image',
      icon: Wand2,
      category: 'edit'
    },
    {
      id: 'background',
      name: 'Change Background',
      description: 'Replace or modify the background',
      icon: ImageIcon,
      category: 'edit'
    }
  ];

  const quickPrompts = {
    style: [
      'Make this look like a Van Gogh painting',
      'Convert to a pencil sketch',
      'Apply watercolor painting style',
      'Transform into anime style',
      'Make it look like a vintage photograph'
    ],
    edit: [
      'Change the background to a beach scene',
      'Remove all people from the image',
      'Add flowers to the scene',
      'Replace the sky with a sunset',
      'Change the season to winter'
    ],
    enhance: [
      'Make the colors more vibrant',
      'Improve the lighting and contrast',
      'Enhance the details and sharpness',
      'Make it look more professional',
      'Brighten and enhance the image'
    ]
  };

  const handleQuickPrompt = (prompt: string) => {
    onCustomPromptChange(prompt);
    onModificationSelect('image-to-image', prompt);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('custom')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === 'custom'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Custom Prompt
        </button>
        <button
          onClick={() => setSelectedCategory('style')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === 'style'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Style Transfer
        </button>
        <button
          onClick={() => setSelectedCategory('edit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === 'edit'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Edit Objects
        </button>
        <button
          onClick={() => setSelectedCategory('enhance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedCategory === 'enhance'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Enhance
        </button>
      </div>

      {/* Custom Prompt */}
      {selectedCategory === 'custom' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe how you want to modify the image
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder="e.g., Make this photo look like a painting, change the background to a forest, add flowers..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
          <button
            onClick={() => onModificationSelect('image-to-image', customPrompt)}
            disabled={loading || !customPrompt.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Modifying Image...
              </span>
            ) : (
              'Modify Image'
            )}
          </button>
        </div>
      )}

      {/* Quick Prompts */}
      {selectedCategory !== 'custom' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick {selectedCategory === 'style' ? 'Style' : selectedCategory === 'edit' ? 'Edit' : 'Enhancement'} Options
          </h3>
          <div className="grid gap-3">
            {quickPrompts[selectedCategory]?.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                disabled={loading}
                className="text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              >
                <p className="text-gray-900 dark:text-white font-medium">{prompt}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modification Options Grid */}
      {selectedCategory !== 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {modificationOptions
            .filter(option => selectedCategory === 'custom' || option.category === selectedCategory)
            .map((option) => (
              <div
                key={option.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  <option.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageModificationPanel;