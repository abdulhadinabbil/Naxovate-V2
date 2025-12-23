import React, { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import { supabase } from '../lib/supabase';

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedUrl: string) => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ imageUrl, onSave }) => {
  const editorRef = useRef<ImageEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = new ImageEditor(containerRef.current, {
        includeUI: {
          loadImage: {
            path: imageUrl,
            name: 'SampleImage',
          },
          theme: {
            'common.bi.image': '',
            'common.bisize.width': '251px',
            'common.bisize.height': '21px',
            'common.backgroundImage': 'none',
            'common.backgroundColor': '#1e1e1e',
            'common.border': '0px',
          },
          menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
          initMenu: 'filter',
          uiSize: {
            width: '100%',
            height: '600px',
          },
          menuBarPosition: 'bottom',
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
      });

      // Initialize the editor after a short delay
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.loadImageFromURL(imageUrl, 'Sample').then(() => {
            editorRef.current?.clearUndoStack();
          });
        }
      }, 100);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [imageUrl]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    try {
      // Get edited image as base64
      const editedImageData = editorRef.current.toDataURL();
      
      // Convert base64 to blob
      const response = await fetch(editedImageData);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileName = `edited_${Date.now()}.png`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('edited_photos')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('edited_photos')
        .getPublicUrl(fileName);

      onSave(urlData.publicUrl);
    } catch (error: any) {
      console.error('Error saving edited photo:', error);
    }
  };

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full h-[600px]" />
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Save Edited Photo
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;