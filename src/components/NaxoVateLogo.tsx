import React from 'react';

interface NaxoVateLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

const NaxoVateLogo: React.FC<NaxoVateLogoProps> = ({ 
  size = 'md', 
  className = '',
  showText = true,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const getTextColors = () => {
    switch (variant) {
      case 'white':
        return 'from-white via-blue-100 to-white';
      case 'dark':
        return 'from-slate-800 via-blue-900 to-slate-800';
      default:
        return 'from-blue-600 via-blue-700 to-cyan-600';
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon with Professional Gradient Border */}
      <div className="relative group">
        {/* Enhanced gradient background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
        
        {/* Main logo container with enhanced styling and gradient border */}
        <div className={`relative ${sizeClasses[size]} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-sm`}>
          {/* Professional gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl p-0.5">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Logo Image */}
              <img 
                src="/WhatsApp Image 2025-07-04 at 20.55.18(1).jpg" 
                alt="NaxoVate Logo" 
                className="w-full h-full object-contain p-1 rounded-xl"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback text logo */}
              <div 
                className="w-full h-full items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent hidden"
                style={{ display: 'none' }}
              >
                N
              </div>
            </div>
          </div>
          
          {/* Additional glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-cyan-400/20 rounded-2xl transition-all duration-500"></div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping delay-150"></div>
      </div>

      {/* Logo Text with enhanced styling */}
      {showText && (
        <div className="relative">
          {/* Text glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent blur-sm opacity-50"></div>
          <span className={`relative ${textSizeClasses[size]} font-bold bg-gradient-to-r ${getTextColors()} bg-clip-text text-transparent drop-shadow-sm`}>
            NaxoVate
          </span>
        </div>
      )}
    </div>
  );
};

export default NaxoVateLogo;