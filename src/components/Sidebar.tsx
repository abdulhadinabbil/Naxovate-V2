import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Settings,
  X,
  Image,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { cn } from '../utils/cn';
import NaxoVateLogo from './NaxoVateLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Instructions', icon: BookOpen, path: '/instructions' },
    { label: 'AI Generator', icon: Image, path: '/ai-generator' },
    { label: 'Generated Images', icon: Image, path: '/generated-images' },
    { label: 'Support', icon: MessageCircle, path: '/support' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-blue-100/50 dark:border-blue-800/50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-blue-100/50 dark:border-blue-800/50">
            <Link to="/" className="group" onClick={onClose}>
              <NaxoVateLogo 
                size="md" 
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Close button - mobile only */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>

          {/* User section */}
          {user && (
            <div className="p-6 border-b border-blue-100/50 dark:border-blue-800/50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {user.email?.split('@')[0]}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <item.icon className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;