import React from 'react';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Palette, 
  Image as ImageIcon,
  Brush,
  Wand2,
  Camera,
  Layers,
  Zap,
  MessageCircle,
  AlertCircle,
  Star,
  Crown,
  Calendar
} from 'lucide-react';

const InstructionsPanel = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Complete User Guide
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How to Use NaxoVate
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Everything you need to know about purchasing plans and creating amazing AI art
        </p>
      </div>

      {/* Purchase & Activation Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            How to Purchase & Activate Your Plan
          </h3>
        </div>

        {/* International Payment */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              💳 Debit/Credit Card Payment
            </h4>
          </div>
          
          <div className="space-y-4 ml-7">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-semibold text-gray-900 dark:text-white">Basic Plan ($2)</span>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Generate 10 AI images - Best Starter</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-semibold text-gray-900 dark:text-white">Monthly Plan ($10/month)</span>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Generate 60 AI images – ideal for regular users.</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-semibold text-gray-900 dark:text-white">Yearly Plan ($100/year)</span>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Generate 650 AI images – save 16.67% and enjoy uninterrupted creativity all year round.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-medium text-green-800 dark:text-green-300">⭐ Activation:</span>
              </div>
              <p className="text-green-700 dark:text-green-400 text-sm">
                Your subscription will be activated immediately after payment.
                If you face any issues, simply submit a support ticket, and our team will resolve it within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Local Payment */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              🇧🇩 Bangladeshi Local Payments (Bkash, Rocket, Nagad)
            </h4>
          </div>
          
          <div className="space-y-3 ml-7">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold mr-3 mt-0.5">1</span>
                  <span>Send the subscription amount to our provided Bkash, Rocket, or Nagad number.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold mr-3 mt-0.5">2</span>
                  <span>Copy your Transaction ID or last 4 digits.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold mr-3 mt-0.5">3</span>
                  <span>Submit a support ticket with your payment details.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold mr-3 mt-0.5">4</span>
                  <span>Your subscription will be activated within 24 hours.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="font-medium text-yellow-800 dark:text-yellow-300">🔔 Note:</span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">
            Any remaining credits will expire when your plan ends, whether monthly or yearly.
          </p>
        </div>
      </div>

      {/* AI Generator Usage Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🎨 How to Use the AI Generator
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Step-by-Step Guide:</h4>
            <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5">1</span>
                <div>
                  <span className="font-medium">Write Your Prompt:</span> Describe what you want to create in detail. Be specific about colors, style, mood, and objects.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5">2</span>
                <div>
                  <span className="font-medium">Choose Your Style:</span> Select from 8 different artistic styles to match your vision.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5">3</span>
                <div>
                  <span className="font-medium">Use Voice Input (Optional):</span> Click the microphone to speak your prompt instead of typing.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5">4</span>
                <div>
                  <span className="font-medium">Generate & Edit:</span> Click "Generate Image" and then use our advanced editor to perfect your creation.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5">5</span>
                <div>
                  <span className="font-medium">Share & Download:</span> Save your masterpiece and share it with professional branded URLs.
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">💡 Pro Tips for Better Results:</h4>
            <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-400">
              <li>• Be descriptive: "A majestic lion in a golden savanna at sunset" works better than just "lion"</li>
              <li>• Include lighting: "soft morning light", "dramatic shadows", "neon lighting"</li>
              <li>• Specify composition: "close-up portrait", "wide landscape view", "bird's eye view"</li>
              <li>• Add mood: "peaceful", "energetic", "mysterious", "vibrant"</li>
              <li>• Use artistic references: "in the style of Van Gogh", "photorealistic", "minimalist"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Available Styles Section */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🌟 Available AI Art Styles
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Cinematic', icon: Layers, desc: 'Movie-quality renders' },
            { name: 'Fantasy Art', icon: Sparkles, desc: 'Epic fantasy scenes' },
            { name: 'Digital Art', icon: ImageIcon, desc: 'Modern digital mastery' },
            { name: 'Neon Punk', icon: Zap, desc: 'Cyberpunk aesthetics' },
            { name: 'Analog Film', icon: Palette, desc: 'Vintage film look' },
            { name: 'Comic Book', icon: Brush, desc: 'Professional comics' },
            { name: 'Isometric', icon: Wand2, desc: '3D technical art' }
          ].map((style, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 text-center">
              <style.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{style.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{style.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            💬 Need Help?
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            NaxoVate's 24/7 Support Team is always here for you.
            Submit a support ticket anytime for assistance with payments, subscriptions, or usage.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">24-hour response</span>
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Expert assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Baic Plan Images</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">60+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Images</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">650+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yearly Images</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">15+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Art Styles</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">24/7</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel;