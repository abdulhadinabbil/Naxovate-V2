import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/subscription');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Cancel Animation */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-xl opacity-30"></div>
        </div>

        {/* Cancel Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-slate-900 dark:from-white dark:via-red-200 dark:to-white bg-clip-text text-transparent mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
            No worries, you can try again anytime
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your subscription process was cancelled and no payment was made
          </p>
        </div>

        {/* Information Box */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-red-100/50 dark:border-red-800/50 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            What happened?
          </h2>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 text-left">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>The payment process was interrupted or cancelled</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>No charges were made to your payment method</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>You can retry the subscription process anytime</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/subscription')}
            className="group relative w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <span className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </span>
          </button>
        </div>

        {/* Auto-redirect Notice */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Redirecting to subscription page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCancelPage;