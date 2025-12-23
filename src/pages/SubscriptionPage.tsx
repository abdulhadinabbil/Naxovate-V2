import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { stripeService } from '../services/stripeService';
import { Check, Loader, Crown, Star, Zap } from 'lucide-react';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const sub = await stripeService.getSubscriptionStatus();
        setSubscription(sub);
      } catch (err: any) {
        console.error('Error fetching subscription:', err);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);
      setError(null);

      const product = Object.values(STRIPE_PRODUCTS).find(p => p.priceId === priceId);
      if (!product) {
        throw new Error('Invalid product selected');
      }

      const checkoutUrl = await stripeService.createCheckoutSession(product);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  };

  const isCurrentPlan = (priceId: string) => {
    return subscription?.subscription_status === 'active' && subscription?.price_id === priceId;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please log in to view subscription options.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <Crown className="w-4 h-4 mr-2" />
          Premium Plans
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Unlock premium AI image generation and enhance your creative journey
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Current Subscription Status */}
      {subscription?.subscription_status === 'active' && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              You have an active {subscription.price_id === STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId ? 'Monthly' : 'Yearly'} subscription
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{STRIPE_PRODUCTS.BASIC_PLAN.description}</p>

            <div className="mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                ${STRIPE_PRODUCTS.BASIC_PLAN.price}
                <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/once</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">One-time purchase</p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                {STRIPE_PRODUCTS.BASIC_PLAN.description}
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Basic AI image generation
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Standard image quality
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Download options
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(STRIPE_PRODUCTS.BASIC_PLAN.priceId)}
              disabled={loading === STRIPE_PRODUCTS.BASIC_PLAN.priceId || isCurrentPlan(STRIPE_PRODUCTS.BASIC_PLAN.priceId)}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading === STRIPE_PRODUCTS.BASIC_PLAN.priceId ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : isCurrentPlan(STRIPE_PRODUCTS.BASIC_PLAN.priceId) ? (
                'Current Plan'
              ) : (
                'Get Started'
              )}
            </button>
          </div>
        </div>

        {/* Monthly Plan */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Premium</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{STRIPE_PRODUCTS.MONTHLY_PREMIUM.description}</p>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                ${STRIPE_PRODUCTS.MONTHLY_PREMIUM.price}
                <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Billed monthly</p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                {STRIPE_PRODUCTS.MONTHLY_PREMIUM.description}
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Advanced AI image generation with multiple styles
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                High-quality image output
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Professional sharing and download options
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Priority support
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId)}
              disabled={loading === STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId || isCurrentPlan(STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId)}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading === STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : isCurrentPlan(STRIPE_PRODUCTS.MONTHLY_PREMIUM.priceId) ? (
                'Current Plan'
              ) : (
                'Subscribe Monthly'
              )}
            </button>
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly Premium</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{STRIPE_PRODUCTS.YEARLY_PREMIUM.description}</p>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                ${STRIPE_PRODUCTS.YEARLY_PREMIUM.price}
                <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/year</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Billed yearly</p>
            </div>

            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                {STRIPE_PRODUCTS.YEARLY_PREMIUM.description}
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Advanced AI image generation with multiple styles
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                High-quality image output
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Professional sharing and download options
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                Priority support
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId)}
              disabled={loading === STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId || isCurrentPlan(STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading === STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : isCurrentPlan(STRIPE_PRODUCTS.YEARLY_PREMIUM.priceId) ? (
                'Current Plan'
              ) : (
                'Subscribe Yearly'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Secure Payment Processing
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm4.64-4.36c.39-.39 1.02-.39 1.41 0L12 11.59l3.95-3.95c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 13l3.95 3.95c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0L12 14.41l-3.95 3.95c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 13 6.64 9.05c-.39-.39-.39-1.02 0-1.41z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Stripe Secure</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All payments are processed securely through Stripe with industry-standard encryption
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mb-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Access</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get immediate access to premium features after successful payment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What happens to unused credits?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unused credits expire at the end of your billing period and do not carry over to the next cycle.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel my subscription anytime?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We accept all major credit cards and debit cards through our secure Stripe payment processor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;