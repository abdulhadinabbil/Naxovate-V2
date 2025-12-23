import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Camera, Edit, Link as LinkIcon, Save, X, Eye } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) return;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          setError('Profile not found');
          return;
        }

        setProfile(profileData);
        setBio(profileData.bio || '');
        setWebsite(profileData.website || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhotoFile(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let avatarUrl = profile?.avatar_url;
      let coverPhotoUrl = profile?.cover_photo_url;

      // Handle avatar upload
      if (avatarFile) {
        if (avatarUrl) {
          const oldAvatarPath = avatarUrl.split('/').pop();
          if (oldAvatarPath) {
            await supabase.storage
              .from('profile_images')
              .remove([oldAvatarPath]);
          }
        }

        const avatarFileName = `avatar-${user?.id}-${Date.now()}`;
        const { error: avatarError } = await supabase.storage
          .from('profile_images')
          .upload(avatarFileName, avatarFile);

        if (avatarError) throw avatarError;

        const { data: avatarUrlData } = supabase.storage
          .from('profile_images')
          .getPublicUrl(avatarFileName);

        avatarUrl = avatarUrlData.publicUrl;
      }

      // Handle cover photo upload
      if (coverPhotoFile) {
        if (coverPhotoUrl) {
          const oldCoverPath = coverPhotoUrl.split('/').pop();
          if (oldCoverPath) {
            await supabase.storage
              .from('profile_images')
              .remove([oldCoverPath]);
          }
        }

        const coverPhotoFileName = `cover-${user?.id}-${Date.now()}`;
        const { error: coverPhotoError } = await supabase.storage
          .from('profile_images')
          .upload(coverPhotoFileName, coverPhotoFile);

        if (coverPhotoError) throw coverPhotoError;

        const { data: coverPhotoUrlData } = supabase.storage
          .from('profile_images')
          .getPublicUrl(coverPhotoFileName);

        coverPhotoUrl = coverPhotoUrlData.publicUrl;
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio,
          website,
          avatar_url: avatarUrl,
          cover_photo_url: coverPhotoUrl,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({
        ...profile!,
        bio,
        website,
        avatar_url: avatarUrl,
        cover_photo_url: coverPhotoUrl,
      });

      // Clean up preview URLs
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPhotoPreview) URL.revokeObjectURL(coverPhotoPreview);

      // Reset file states
      setAvatarFile(null);
      setCoverPhotoFile(null);
      setAvatarPreview(null);
      setCoverPhotoPreview(null);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Cover Photo Section */}
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600">
          {(profile.cover_photo_url || coverPhotoPreview) && (
            <img 
              src={coverPhotoPreview || profile.cover_photo_url!} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Cover Photo Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            {(profile.cover_photo_url || coverPhotoPreview) && (
              <button
                onClick={() => setShowCoverModal(true)}
                className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                title="View cover photo"
              >
                <Eye className="h-5 w-5" />
              </button>
            )}
            
            {isOwnProfile && editing && (
              <label className="bg-black bg-opacity-50 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-70 transition">
                <Camera className="h-5 w-5" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                />
              </label>
            )}
          </div>

          {/* Profile Picture Container */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                {(profile.avatar_url || avatarPreview) ? (
                  <img 
                    src={avatarPreview || profile.avatar_url!} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl md:text-5xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Avatar Actions */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                {(profile.avatar_url || avatarPreview) && (
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-lg"
                    title="View profile picture"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                
                {isOwnProfile && editing && (
                  <label className="bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                    <Camera className="h-4 w-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 md:pt-8 px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Profile Info - Left Side */}
            <div className="flex-1 text-center md:text-left md:ml-48">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    @{profile.username}
                  </p>
                </div>
                
                {/* Action Buttons */}
                {isOwnProfile && (
                  <div className="flex justify-center md:justify-start gap-3 mt-4 md:mt-0">
                    {editing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false);
                            setBio(profile.bio || '');
                            setWebsite(profile.website || '');
                            setAvatarPreview(null);
                            setCoverPhotoPreview(null);
                          }}
                          className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {profile.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>

              {/* Website Section */}
              <div className="mb-6">
                {editing ? (
                  <div className="flex items-center">
                    <LinkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://your-website.com"
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ) : profile.website ? (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {profile.website}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (profile.avatar_url || avatarPreview) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={avatarPreview || profile.avatar_url!}
              alt={`${profile.name}'s profile picture`}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {profile.name}'s Profile Picture
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Cover Photo Modal */}
      {showCoverModal && (profile.cover_photo_url || coverPhotoPreview) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowCoverModal(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={coverPhotoPreview || profile.cover_photo_url!}
              alt={`${profile.name}'s cover photo`}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {profile.name}'s Cover Photo
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}