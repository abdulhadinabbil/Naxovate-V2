import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Globe, Users, Mail, Calendar, Database } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100/50 dark:border-blue-800/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Security
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-slate-900 dark:from-white dark:via-green-200 dark:to-white bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            How we collect, use, and protect your information
          </p>
          <div className="mt-4 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-2" />
            Last revised: June 30, 2025
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            This Privacy Policy describes how NaxoVate ("NaxoVate", "we", "us", "our") collects, uses, and discloses information about you when you use our web, applications, services, tools, and features, or otherwise interact with us (collectively, the "Services"). For the purposes of this Privacy Policy, NaxoVate is the data controller for your information, and "you" means the user of the Services.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            By using our Services, you agree to the collection, use, and disclosure of your information as described below. If you do not agree, please do not use the Services.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Changes to this Privacy Policy
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We may update this Privacy Policy periodically. The "Last revised" date at the top indicates when it was last updated. Continued use of the Services after updates constitutes your acceptance of the revised Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Database className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              Collection and Use of Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                  Information You Provide to Us
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">When you use NaxoVate, you may provide:</p>
                
                <div className="grid gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Information
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      Such as your email address for account creation, verification, and communication.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Account Information
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      Such as username, password, and profile settings to maintain your account and ensure security.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Payment Information
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      Processed securely via our payment providers (we do not store your full card details) to manage subscriptions and transactions.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      User Input
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      Such as text prompts and uploaded images to generate AI art, which may be used to provide and improve our services.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-cyan-600 dark:text-cyan-400 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Support Communications
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      Any messages or inquiries you send to our support team to assist you effectively.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                  Information Collected Automatically
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">We may automatically collect:</p>
                
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Device Information:</strong> such as device type, browser, and IP address to improve security and user experience.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Usage Data:</strong> including your interactions with the Services, selected styles, and generation history to enhance and personalize the platform.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              Sharing of Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">We may share your information with:</p>
            
            <ul className="space-y-3 text-slate-700 dark:text-slate-300 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <strong>Service Providers:</strong> who support our operations (e.g. payment processors, hosting, AI API providers).
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <strong>Legal or Regulatory Authorities:</strong> if required by law or to protect our rights, users, and services.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <strong>In Connection with Business Transfers:</strong> such as mergers or acquisitions.
              </li>
            </ul>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <p className="text-green-800 dark:text-green-300 font-medium">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
              Data Security
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We use reasonable security measures to protect your information. However, no online system is completely secure. You are responsible for maintaining your account credentials safely.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              Your Choices
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                You can update your account information anytime via your profile settings.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                You may request deletion of your account by contacting support (note: some information may remain for legal or operational reasons).
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                You can opt out of promotional emails through the unsubscribe link but will still receive essential service notifications.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
              Children's Privacy
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              NaxoVate is not intended for users under 13. We do not knowingly collect personal information from children. If you believe we have done so, please contact us to delete such information.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Globe className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mr-3" />
              International Users
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Your information may be processed and stored in countries outside your own, including where data protection laws may differ.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              Contact Us
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us via our{' '}
              <Link to="/support" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Support Ticket System
              </Link>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 italic">
            Thank you for trusting NaxoVate with your creative journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;