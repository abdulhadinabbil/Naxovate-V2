import React, { useState, useRef, useEffect } from 'react';
import { X, Undo, Redo, Save, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop, Palette, Sliders, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface AdvancedImageEditorProps {
  imageUrl: string;
  onImageEdited: (editedUrl: string) => void;
  onClose: () => void;
}

interface EditState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  grayscale: number;
  hue: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

const AdvancedImageEditor: React.FC<AdvancedImageEditorProps> = ({ 
  imageUrl, 
  onImageEdited, 
  onClose 
}) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'transform' | 'crop'>('filters');
  
  // Edit states and history
  const [currentState, setCurrentState] = useState<EditState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hue: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
  });

  const [history, setHistory] = useState<EditState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize history with default state
  useEffect(() => {
    const initialState = { ...currentState };
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  // Apply filters to canvas
  const applyFilters = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Set canvas size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.translate(centerX, centerY);
    
    // Apply rotation
    if (currentState.rotation !== 0) {
      ctx.rotate((currentState.rotation * Math.PI) / 180);
    }

    // Apply flips
    ctx.scale(
      currentState.flipX ? -1 : 1,
      currentState.flipY ? -1 : 1
    );

    ctx.translate(-centerX, -centerY);

    // Apply filters
    ctx.filter = `
      brightness(${currentState.brightness}%)
      contrast(${currentState.contrast}%)
      saturate(${currentState.saturation}%)
      blur(${currentState.blur}px)
      sepia(${currentState.sepia}%)
      grayscale(${currentState.grayscale}%)
      hue-rotate(${currentState.hue}deg)
    `;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Restore context state
    ctx.restore();
  };

  // Update state and add to history
  const updateState = (newState: Partial<EditState>) => {
    const updatedState = { ...currentState, ...newState };
    setCurrentState(updatedState);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentState(history[historyIndex - 1]);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentState(history[historyIndex + 1]);
    }
  };

  // Reset to original
  const resetFilters = () => {
    const resetState: EditState = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      hue: 0,
      rotation: 0,
      flipX: false,
      flipY: false,
    };
    updateState(resetState);
  };

  // Save edited image
  const saveEditedImage = async () => {
    if (!canvasRef.current || !user) return;

    try {
      setLoading(true);

      // Get canvas data as blob
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.9);
      });

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
          original_url: imageUrl,
          edited_url: urlData.publicUrl,
          edit_history: currentState,
        });

      if (dbError) throw dbError;

      onImageEdited(urlData.publicUrl);
    } catch (err: any) {
      console.error('Error saving edited image:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download current edit
  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `naxovate-edited-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  // Apply filters when state changes
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      applyFilters();
    }
  }, [currentState]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Image Editor</h2>
          <div className="flex items-center gap-3">
            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="h-5 w-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="h-5 w-5" />
            </button>
            
            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Image Preview */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="relative max-w-full max-h-full">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Original"
                  className="hidden"
                  onLoad={applyFilters}
                  crossOrigin="anonymous"
                />
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'filters'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Sliders className="h-4 w-4 mx-auto mb-1" />
                Filters
              </button>
              <button
                onClick={() => setActiveTab('transform')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'transform'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <RotateCw className="h-4 w-4 mx-auto mb-1" />
                Transform
              </button>
            </div>

            {/* Controls Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'filters' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Color & Effects</h3>
                  
                  {/* Brightness */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Brightness: {currentState.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={currentState.brightness}
                      onChange={(e) => updateState({ brightness: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contrast: {currentState.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={currentState.contrast}
                      onChange={(e) => updateState({ contrast: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Saturation: {currentState.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={currentState.saturation}
                      onChange={(e) => updateState({ saturation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Hue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hue: {currentState.hue}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentState.hue}
                      onChange={(e) => updateState({ hue: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Blur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blur: {currentState.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentState.blur}
                      onChange={(e) => updateState({ blur: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Sepia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sepia: {currentState.sepia}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentState.sepia}
                      onChange={(e) => updateState({ sepia: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Grayscale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grayscale: {currentState.grayscale}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentState.grayscale}
                      onChange={(e) => updateState({ grayscale: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'transform' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Transform</h3>
                  
                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rotation: {currentState.rotation}°
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => updateState({ rotation: currentState.rotation - 90 })}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        -90°
                      </button>
                      <button
                        onClick={() => updateState({ rotation: currentState.rotation + 90 })}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center"
                      >
                        <RotateCw className="h-4 w-4 mr-1" />
                        +90°
                      </button>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentState.rotation}
                      onChange={(e) => updateState({ rotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Flip */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Flip
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateState({ flipX: !currentState.flipX })}
                        className={`flex-1 px-3 py-2 rounded-lg transition flex items-center justify-center ${
                          currentState.flipX
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FlipHorizontal className="h-4 w-4 mr-1" />
                        Horizontal
                      </button>
                      <button
                        onClick={() => updateState({ flipY: !currentState.flipY })}
                        className={`flex-1 px-3 py-2 rounded-lg transition flex items-center justify-center ${
                          currentState.flipY
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FlipVertical className="h-4 w-4 mr-1" />
                        Vertical
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Reset All
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={downloadImage}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                
                <button
                  onClick={saveEditedImage}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedImageEditor;