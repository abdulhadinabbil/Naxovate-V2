import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { Lock, Image as ImageIcon, CreditCard as Edit3, Share2, CreditCard, Phone, RefreshCw, Download, Settings, Zap, Palette, Sliders } from 'lucide-react';
import VoicePrompt from '../components/VoicePrompt';
import AdvancedImageEditor from '../components/AdvancedImageEditor';
import ProfessionalShareModal from '../components/ProfessionalShareModal';
import { supabase } from '../lib/supabase';
import { downloadImageFromUrl, getDisplayUrl, getOriginalUrl } from '../utils/urlUtils';
import {
  dreamstudioService,
  AI_ASPECT_RATIOS,
  STYLE_PRESETS,
  type DreamStudioConfig
} from '../services/dreamstudioService';


const AIGeneratorPage = () => {
  const { user } = useAuth();
  const { plan, canGenerateImages, canGenerateMultipleImages, incrementImagesGenerated, incrementImagesByCount, getRemainingGenerations, checkSubscription } = useSubscriptionStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [config, setConfig] = useState<DreamStudioConfig>({
    aspect_ratio: '1:1',
    model: 'sd3.5-large-turbo',
    output_format: 'jpeg',
    cfg_scale: 7.5,
    style_preset: '',
    num_images: 1,
    negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy',
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        setCheckingAccess(true);
        
        if (user.email === 'nabil4457@gmail.com') {
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        await checkSubscription();
        
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscription && subscription.plan === 'premium' && subscription.status === 'active') {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error('Error checking access:', err);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [user, checkSubscription]);

  const handleVoicePrompt = (transcript: string) => {
    setPrompt(transcript);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!hasAccess) {
      setError('You need premium access to generate images');
      return;
    }

    if (user?.email !== 'nabil4457@gmail.com' && !canGenerateImages()) {
      setError('You have reached your monthly limit of image generations');
      return;
    }

    // Check if user has enough credits for the number of images
    const creditsNeeded = (config.num_images || 1) * dreamstudioService.getCreditsPerImage(config.model);
    const remainingGenerations = getRemainingGenerations();

    if (user?.email !== 'nabil4457@gmail.com' && remainingGenerations < creditsNeeded) {
      setError(`You need ${creditsNeeded} credits but only have ${remainingGenerations} remaining`);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      console.log('Starting SD 3.5 Large Turbo generation...');
      
      // Generate image using SD 3.5 Large Turbo
      const imageUrl = await dreamstudioService.generateImage(prompt, {
        ...config,
      });

      console.log('Image generated successfully:', imageUrl);

      // Save to database
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert({
          url: imageUrl,
          prompt,
          style: config.style_preset || 'sd3.5-large-turbo-default',
          user_id: user?.id
        });

      if (dbError) throw dbError;

      setGeneratedImage(imageUrl);
      setEditedImage(null);
      
      // Deduct credits based on number of images generated
      if (user?.email !== 'nabil4457@gmail.com') {
        // Increment by the credits used for this generation
        await incrementImagesByCount(creditsNeeded);
      }
      
      console.log('Image saved to database and state updated');
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateImage();
  };

  const handleRefresh = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }
    await generateImage();
  };

  const handleDownload = async () => {
    const imageUrl = getCurrentImage();
    if (!imageUrl) return;

    try {
      setDownloading(true);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const styleLabel = config.style_preset || 'sd3.5-default';
      const fileName = `naxovate-${styleLabel.replace(/\s+/g, '-')}-${timestamp}.png`;
      
      await downloadImageFromUrl(getOriginalUrl(imageUrl), fileName);
    } catch (err: any) {
      setError('Failed to download image');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleImageEdited = (editedUrl: string) => {
    setEditedImage(editedUrl);
    setShowImageEditor(false);
  };

  const getCurrentImage = () => editedImage || generatedImage;

  const updateConfig = (key: keyof DreamStudioConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (checkingAccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium Feature</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              AI Image Generator is available exclusively for Premium subscribers.
            </p>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-3">
                  <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  International Payment
                </h3>
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Secure payment via Stripe:</strong> Pay with credit/debit cards from anywhere in the world
                </p>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Pricing:</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Basic Plan: <strong className="text-indigo-600 dark:text-indigo-400">$2</strong> (10 images)</div>
                    <div>Monthly Plan: <strong className="text-indigo-600 dark:text-indigo-400">$10/month</strong> (60 images)</div>
                    <div>Yearly Plan: <strong className="text-indigo-600 dark:text-indigo-400">$100/year</strong> (650 images) - Save 16.67%!</div>
                  </div>
                </div>

                <Link
                  to="/subscription"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition font-medium"
                >
                  Subscribe with Stripe
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-3">
                  <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mobile Payment (Bangladesh)
                </h3>
              </div>
              
              <div className="text-left space-y-3">
                <p className="text-gray-700 dark:text-gray-300 text-sm text-center">
                  <strong>For Bangladeshi users:</strong> You can pay using Bkash or Rocket and get premium access!
                </p>
                
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Payment Instructions:</span>
                  </div>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-7">
                    <li>1. Send payment via <strong>Bkash</strong> or <strong>Rocket</strong> to: <strong className="text-green-600 dark:text-green-400">+8801745648600</strong></li>
                    <li>2. Monthly Plan: <strong>৳1200</strong> | Yearly Plan: <strong>৳12000</strong></li>
                    <li>3. After payment, create a <Link to="/support" className="text-green-600 dark:text-green-400 hover:underline font-medium">support ticket</Link> with:</li>
                    <li className="ml-4">• Transaction ID</li>
                    <li className="ml-4">• Payment amount</li>
                    <li className="ml-4">• Your preferred plan (Monthly/Yearly)</li>
                    <li>4. We'll activate your premium access within 24 hours!</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Link
                    to="/support"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium"
                  >
                    Create Support Ticket
                  </Link>
                  <Link
                    to="/subscription"
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-center font-medium"
                  >
                    View All Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Image Generator</h1>
              <p className="text-gray-600 dark:text-gray-400">Create stunning images with NaxoVate</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {getCurrentImage() && (
                <button
                  onClick={() => setShowImageEditor(true)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition flex items-center justify-center"
                >
                  <Edit3 className="h-5 w-5 mr-2" />
                  Edit Image
                </button>
              )}
              <Link
                to="/generated-images"
                className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/40 transition flex items-center justify-center"
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                View Gallery
              </Link>
            </div>
          </div>
          {user?.email !== 'nabil4457@gmail.com' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Remaining generations: {getRemainingGenerations()} this month
            </p>
          )}
          {user?.email === 'nabil4457@gmail.com' && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✨ Admin Access - Unlimited generations
            </p>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Describe your image
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                <textarea
                  id="prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <div className="flex justify-center md:justify-start">
                  <VoicePrompt onTranscript={handleVoicePrompt} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="aspect_ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aspect Ratio
                </label>
                <select
                  id="aspect_ratio"
                  value={config.aspect_ratio || '1:1'}
                  onChange={(e) => updateConfig('aspect_ratio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {AI_ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Style Preset
                </label>
                <select
                  id="style"
                  value={config.style_preset || ''}
                  onChange={(e) => updateConfig('style_preset', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {STYLE_PRESETS.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Negative Prompt (Optional)
                </label>
                <input
                  id="negative_prompt"
                  type="text"
                  value={config.negative_prompt || ''}
                  onChange={(e) => updateConfig('negative_prompt', e.target.value)}
                  placeholder="What you don't want to see..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
              >
                <Settings className="h-4 w-4 mr-2" />
                Generation Settings
                <Sliders className={`h-4 w-4 ml-2 transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Credits needed: <span className="font-medium text-indigo-600 dark:text-indigo-400">{dreamstudioService.getCreditsPerImage(config.model || 'sd3.5-large-turbo')}</span>
              </div>
            </div>

            {/* Advanced Settings */}
            {showAdvancedSettings && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Advanced Settings
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="cfg_scale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prompt Adherence (Guidance Scale): {config.cfg_scale || 7.5}
                    </label>
                    <input
                      type="range"
                      id="cfg_scale"
                      min="1"
                      max="20"
                      step="0.5"
                      value={config.cfg_scale || 7.5}
                      onChange={(e) => updateConfig('cfg_scale', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Higher values = AI follows your prompt more strictly (Default: 7.5 for clear, detailed images)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quality Filters
                    </label>
                    <textarea
                      id="negative_prompt_settings"
                      rows={2}
                      value={config.negative_prompt || 'blurry, low quality, distorted, ugly, bad anatomy'}
                      onChange={(e) => updateConfig('negative_prompt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      What to avoid in generated images (default filters ensure clarity)
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Pro Tips for Best Results:</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Default guidance scale 7.5 ensures clear, prompt-focused images</li>
                    <li>• Increase to 10-15 for very specific requirements, decrease to 5-6 for creative freedom</li>
                    <li>• Quality filters are pre-set to avoid blurry or distorted outputs</li>
                    <li>• Be descriptive: "oil painting of a sunset over mountains, golden hour, highly detailed" works better than "sunset"</li>
                    <li>• Use style presets to define artistic direction (Photographic, Cinematic, Digital Art, etc.)</li>
                    <li>• Try different guidance values to find the perfect balance for your vision</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg" role="alert">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating with AI...
                  </span>
                ) : (
                  'Generate Image'
                )}
              </button>

              {generatedImage && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading || !prompt.trim()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                  title="Regenerate with same settings (uses 1 token)"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </form>

          {getCurrentImage() && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editedImage ? 'Edited Image' : 'Generated Image'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition flex items-center text-sm disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {downloading ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    onClick={() => setShowImageEditor(true)}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition flex items-center text-sm"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowSocialShare(true)}
                    className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition flex items-center text-sm"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <img
                  src={getCurrentImage()}
                  onLoad={() => console.log('Image loaded successfully:', getCurrentImage())}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Image failed to load:', getCurrentImage());
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-600 rounded-lg';
                    errorDiv.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Image failed to load. Please try generating again.</p>';
                    target.parentNode?.appendChild(errorDiv);
                  }}
                  alt="AI Generated Image"
                  className="max-w-full h-auto rounded-lg mx-auto"
                />
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Shareable Link:
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">
                  {getDisplayUrl(getCurrentImage()!)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  This branded URL will be used when sharing your image
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600 dark:text-gray-400 italic">"{prompt}"</p>
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                  <span>Model: SD 3.5 Large</span>
                  <span>Style: {config.style_preset || 'Default'}</span>
                  <span>Aspect: {config.aspect_ratio}</span>
                  <span>Credits Used: {dreamstudioService.getCreditsPerImage(config.model)}</span>
                </div>
                {editedImage && (
                  <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">
                    ✨ Image has been edited
                  </p>
                )}
              </div>
            </div>
          )}

          {!getCurrentImage() && !loading && (
            <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Your AI generated image will appear here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Powered by SD 3.5 Large
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Image Editor Modal */}
      {showImageEditor && getCurrentImage() && (
        <AdvancedImageEditor
          imageUrl={getCurrentImage()!}
          onImageEdited={handleImageEdited}
          onClose={() => setShowImageEditor(false)}
        />
      )}

      {/* Share Modal */}
      {showSocialShare && getCurrentImage() && (
        <ProfessionalShareModal
          imageUrl={getCurrentImage()!}
          caption={prompt}
          onClose={() => setShowSocialShare(false)}
        />
      )}
    </div>
  );
};

export default AIGeneratorPage;