import React from 'react';
import { Code, Database, Shield, Zap, Lock, Mail } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const titleWords = ["Master", "Django", "REST", "API", "Authentication"];
  
  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated background */}
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        
        {/* Floating icons */}
        <div className="floating-icon absolute top-20 left-20 text-blue-400 opacity-20">
          <Code size={60} />
        </div>
        <div className="floating-icon absolute top-40 right-32 text-purple-400 opacity-20" style={{ animationDelay: '0.5s' }}>
          <Database size={50} />
        </div>
        <div className="floating-icon absolute bottom-40 left-32 text-green-400 opacity-20" style={{ animationDelay: '1s' }}>
          <Shield size={55} />
        </div>
        <div className="floating-icon absolute bottom-20 right-20 text-yellow-400 opacity-20" style={{ animationDelay: '1.5s' }}>
          <Zap size={45} />
        </div>
        <div className="floating-icon absolute top-60 left-1/2 text-red-400 opacity-20" style={{ animationDelay: '2s' }}>
          <Lock size={40} />
        </div>
        <div className="floating-icon absolute bottom-60 right-1/3 text-indigo-400 opacity-20" style={{ animationDelay: '2.5s' }}>
          <Mail size={50} />
        </div>
      </div>

      {/* Main content */}
      <div className="hero-content relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className="hero-title text-6xl md:text-8xl font-bold mb-8 leading-tight">
          {titleWords.map((word, index) => (
            <span key={index} className="word inline-block mr-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {word}
            </span>
          ))}
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Build a cinematic, secure authentication system with MongoDB, MySQL, JWT, and OTP verification. 
          A complete guide to production-ready Django REST Framework authentication.
        </p>
        
        <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="stat-item">
            <div className="text-3xl font-bold text-blue-400 mb-2">10+</div>
            <div className="text-gray-400">API Endpoints</div>
          </div>
          <div className="stat-item">
            <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
            <div className="text-gray-400">Databases</div>
          </div>
          <div className="stat-item">
            <div className="text-3xl font-bold text-green-400 mb-2">JWT</div>
            <div className="text-gray-400">Authentication</div>
          </div>
          <div className="stat-item">
            <div className="text-3xl font-bold text-yellow-400 mb-2">OTP</div>
            <div className="text-gray-400">Verification</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;