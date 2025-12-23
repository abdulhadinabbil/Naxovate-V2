import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Users, ArrowRight, Star } from 'lucide-react';
import NaxoVateLogo from '../components/NaxoVateLogo';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-blue-800/10 rounded-3xl"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                <NaxoVateLogo size="sm" showText={false} className="mr-2" />
                AI-Powered Creative Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  NaxoVate
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Your ultimate platform for innovation, creativity, and AI-powered content generation. 
                Transform your ideas into stunning visuals with cutting-edge technology.
              </p>
              
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/register" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-center hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-8 py-4 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-2xl font-semibold text-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/ai-generator" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-center hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      Create with AI
                      <NaxoVateLogo size="sm" showText={false} className="ml-2" />
                    </span>
                  </Link>
                  <Link 
                    to={`/profile/${user.id}`} 
                    className="px-8 py-4 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-2xl font-semibold text-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                  >
                    My Profile
                  </Link>
                </div>
              )}
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
                <img 
                  src="/naxo.png" 
                  alt="AI Innovation" 
                  className="relative rounded-3xl shadow-2xl border border-blue-100/50 dark:border-blue-800/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to bring your creative vision to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-blue-100/50 dark:border-blue-800/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <NaxoVateLogo size="sm" showText={false} variant="white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">AI Image Generation</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create stunning, professional-quality images with NaxoVate. Transform text into visual masterpieces with multiple artistic styles.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-blue-100/50 dark:border-blue-800/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 transform group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Advanced AI Art Engine</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Powered by NaxoVate with 15+ premium artistic styles including Photorealistic, Cinematic, Fantasy Art, Neon Punk, Analog Film, Comic Book, and Isometric designs for professional-grade results.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700/10 to-cyan-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-blue-100/50 dark:border-blue-800/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Professional Sharing</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Share your AI-generated masterpieces with branded URLs, professional download options, and seamless social media integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-800/5 rounded-3xl"></div>
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-12 border border-blue-100/50 dark:border-blue-800/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    10K+
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Active Users</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    50K+
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Images Generated</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    99.9%
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Uptime</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-12 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Ideas?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using NaxoVate to bring their visions to life.
                </p>
                {!user ? (
                  <Link 
                    to="/register" 
                    className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Creating Today
                    <Star className="ml-2 h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                ) : (
                  <Link 
                    to="/ai-generator" 
                    className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Continue Creating
                    <NaxoVateLogo size="sm" showText={false} variant="default" className="ml-2 transform group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;