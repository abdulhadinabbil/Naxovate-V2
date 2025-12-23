import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import InstructionsPanel from '../components/InstructionsPanel';

const InstructionsPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Complete User Guide
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-4">
          NaxoVate Instructions
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Master the art of AI image generation and get the most out of your NaxoVate experience
        </p>
      </div>

      {/* Quick Action Cards */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/register"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Get Started Today</h3>
              <p className="text-blue-100 mb-4">Create your free account and start generating AI art</p>
              <div className="flex items-center">
                <span className="font-medium">Sign Up Free</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          <Link
            to="/subscription"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-purple-100 mb-4">Unlock unlimited AI image generation</p>
              <div className="flex items-center">
                <span className="font-medium">View Plans</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/ai-generator"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Start Creating</h3>
              <p className="text-blue-100 mb-4">Jump into the AI generator and create amazing art</p>
              <div className="flex items-center">
                <span className="font-medium">Generate Images</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          <Link
            to="/generated-images"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">View Gallery</h3>
              <p className="text-purple-100 mb-4">Browse and manage your AI-generated masterpieces</p>
              <div className="flex items-center">
                <span className="font-medium">Open Gallery</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Main Instructions Panel */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100/50 dark:border-blue-800/50 p-8">
        <InstructionsPanel />
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Amazing AI Art?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already using NaxoVate to bring their visions to life.
            </p>
            {!user ? (
              <Link 
                to="/register" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link 
                to="/ai-generator" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Creating
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;