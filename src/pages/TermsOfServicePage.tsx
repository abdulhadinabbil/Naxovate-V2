import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, CreditCard, Clock, AlertCircle, Mail } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100/50 dark:border-blue-800/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <FileText className="w-4 h-4 mr-2" />
            Legal Document
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Please read these terms carefully before using NaxoVate
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Welcome to NaxoVate. Please read these Terms of Service ("Terms") carefully before using our website, services, or products.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
            By accessing or using NaxoVate (the "Service"), you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use the Service.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Overview of Service
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              NaxoVate provides an AI-powered image generation platform allowing users to create digital art in various styles, including Realistic, 3D Render, Anime, Digital Art, Illustration, Painting, Pixel Art, and Sketch. Users can purchase monthly or yearly subscription plans to generate a fixed number of AI images.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              Eligibility
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              You must be at least 13 years old to use NaxoVate. If you are under the age of 18, you must have permission from a parent or legal guardian.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              Account Registration
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                You agree to provide accurate, complete, and updated registration information.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                You are responsible for maintaining the confidentiality of your account and password.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                NaxoVate is not liable for any loss or damage arising from your failure to safeguard your account.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              Subscription Plans and Payments
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4.1 Available Plans</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Monthly Plan</h4>
                    <p className="text-slate-700 dark:text-slate-300">$10 per month, includes 150 AI image generations.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Yearly Plan</h4>
                    <p className="text-slate-700 dark:text-slate-300">$100 per year, includes 1800 AI image generations.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4.2 Payment Methods</h3>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>International Payments:</strong> Debit or credit card payments processed securely through our payment gateway.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-green-600 rounded mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">৳</span>
                    </div>
                    <div>
                      <strong>Bangladesh Local Payments:</strong> Bkash, Rocket, or Nagad. Users must submit payment details and transaction ID to activate their plan within 24 hours.
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4.3 Auto-Renewal</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Subscriptions may auto-renew based on your selected payment provider settings. You are responsible for managing your auto-renewal status directly in your payment provider account. NaxoVate is not responsible for any auto-renewal charges.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              Refund Policy
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 mb-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="font-medium text-yellow-800 dark:text-yellow-300">Important Refund Information</span>
              </div>
            </div>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <strong>Non-Refundable Tokens:</strong> Once you purchase a subscription and use any generation token, your payment becomes non-refundable.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <strong>Unused Tokens:</strong> Refunds are only eligible if no tokens have been used from your active subscription plan.
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                To request a refund for an unused plan, please submit a support ticket within 7 days of purchase.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
              Expiration of Credits
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              All image generation credits (tokens) will expire at the end of your subscription period, whether monthly or yearly. Unused credits do not carry forward to the next billing cycle.
            </p>
          </section>

          {/* Remaining sections with similar styling */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. User Content</h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>• You are responsible for all prompts, inputs, or content you generate using NaxoVate.</li>
              <li>• You agree not to use the Service to create or distribute content that is unlawful, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.</li>
              <li>• NaxoVate reserves the right to remove any content that violates these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Intellectual Property</h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>• All AI-generated images created via NaxoVate are owned by the user, subject to the limitations of third-party AI model licenses.</li>
              <li>• The NaxoVate platform, logo, branding, and all associated intellectual property remain the exclusive property of NaxoVate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Service Availability</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We strive to keep NaxoVate operational at all times but do not guarantee uninterrupted or error-free service. Maintenance or updates may result in temporary unavailability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Termination</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We reserve the right to suspend or terminate your access to NaxoVate at any time if you breach these Terms or misuse the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              To the fullest extent permitted by law, NaxoVate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Indemnification</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              You agree to indemnify and hold harmless NaxoVate, its owners, employees, and partners from any claims, damages, or losses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">13. Changes to Terms</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We may update these Terms from time to time. We will notify you of any significant changes. Your continued use of the Service after updates constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              Contact Us
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              For any questions regarding these Terms, payments, subscriptions, or support, please contact us via our{' '}
              <Link to="/support" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Support Ticket System
              </Link>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400 italic mb-4">
            Thank you for choosing NaxoVate to bring your creative visions to life.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Created with ❤️ by Abdul Hadi Nabil
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;