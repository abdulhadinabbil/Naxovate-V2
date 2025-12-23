import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Instagram, Facebook, Share2, Check, X } from 'lucide-react';

interface SocialShareProps {
  imageUrl: string;
  caption?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ imageUrl, caption = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleShare = async (platform: 'instagram' | 'facebook') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get social connection
      const { data: connection, error: connectionError } = await supabase
        .from('social_connections')
        .select('*')
        .eq('platform', platform)
        .single();

      if (connectionError) throw new Error('Please connect your social media account first');

      // Call edge function to handle sharing
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          imageUrl,
          caption,
          accessToken: connection.access_token,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSuccess(`Successfully shared to ${platform}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <div className="flex">
            <X className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-sm text-green-700 dark:text-green-400">{success}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => handleShare('instagram')}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Instagram className="h-5 w-5 mr-2" />
          Share to Instagram
        </button>

        <button
          onClick={() => handleShare('facebook')}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Facebook className="h-5 w-5 mr-2" />
          Share to Facebook
        </button>
      </div>
    </div>
  );
};

export default SocialShare;