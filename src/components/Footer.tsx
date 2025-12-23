import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import NaxoVateLogo from './NaxoVateLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-blue-800/10"></div>
      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="group mb-6 inline-block">
              <NaxoVateLogo 
                size="md" 
                variant="white"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-slate-300 mb-6 leading-relaxed">
              A platform for innovation, collaboration, and creativity. Transform your ideas into reality with cutting-edge AI technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/naxovate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <Github className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href="https://x.com/naxovate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/company/naxovate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href="https://www.pinterest.com/naxovate/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.818 1.604.818 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 .695.366 1.56.947 1.835.095.045.146.025.168-.067l.213-.859c.019-.075.009-.103-.033-.169-.114-.181-.187-.414-.187-.744 0-1.072.818-2.068 2.175-2.068 1.186 0 2.008.815 2.008 1.934 0 1.288-.55 2.175-1.254 2.175-.396 0-.771-.325-.666-.723.125-.474.367-1.186.367-1.602 0-.37-.198-.679-.608-.679-.483 0-.871.5-.871 1.171 0 .427.144.715.144.715s-.494 2.099-.581 2.467c-.1.422-.015.855-.008 1.01C5.34 16.886 3 14.718 3 12c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ai-generator" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  AI Generator
                </Link>
              </li>
              <li>
                <Link to="/generated-images" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/instructions" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Instructions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-of-service" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Contact</h3>
            <address className="not-italic text-slate-300 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>United Kingdom</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <a href="mailto:contact@naxovate.com" className="hover:text-white transition-colors duration-300">
                  contact@naxovate.com
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-center md:text-left">
              © {currentYear} NaxoVate. All rights reserved.
            </p>
            <p className="text-slate-400 text-center md:text-right">
              Empowering creativity through AI innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;