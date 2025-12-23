import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { stripeService } from '../services/stripeService';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const sub = await stripeService.getSubscriptionStatus();
        setSubscription(sub);
      } catch (err: any) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate('/ai-generator');
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getPlanDetails = () => {
    if (!subscription?.price_id) return null;
    
    if (subscription.price_id === STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId) {
      return {
        name: STRIPE_PRODUCTS.MONTHLY_PREMIUM.name,
        credits: STRIPE_PRODUCTS.MONTHLY_PREMIUM.description,
        price: `£${STRIPE_PRODUCTS.MONTHLY_PREMIUM.price}/month`,
        icon: Sparkles,
        color: 'from-blue-600 to-cyan-500'
      };
    } else if (subscription.price_id === STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId) {
      return {
        name: STRIPE_PRODUCTS.YEARLY_PREMIUM.name,
        credits: STRIPE_PRODUCTS.YEARLY_PREMIUM.description,
        price: `£${STRIPE_PRODUCTS.YEARLY_PREMIUM.price}/year`,
        icon: Crown,
        color: 'from-purple-600 to-indigo-600'
      };
    }
    
    return null;
  };

  const planDetails = getPlanDetails();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl">
            <CheckCircle className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-30 animate-ping"></div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-slate-900 dark:from-white dark:via-green-200 dark:to-white bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
            Welcome to NaxoVate Premium
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your subscription has been activated successfully
          </p>
        </div>

        {/* Plan Details */}
        {loading ? (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/50 mb-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : planDetails ? (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/50 mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${planDetails.color} rounded-xl mb-4`}>
              <planDetails.icon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {planDetails.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              {planDetails.credits}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Billed at {planDetails.price}
            </p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/50 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Premium Access Activated
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              You now have access to all premium features
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            What's Next?
          </h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mr-3"></div>
              <span>Start generating amazing AI images</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mr-3"></div>
              <span>Explore multiple artistic styles</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full mr-3"></div>
              <span>Share your creations professionally</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/ai-generator')}
          className="group relative w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            Start Creating with AI
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </button>

        {/* Auto-redirect Notice */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          Redirecting to AI Generator in a few seconds...
        </p>

        {/* Session ID for debugging (only in development) */}
        {sessionId && process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Session: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;