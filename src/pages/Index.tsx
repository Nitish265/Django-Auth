import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import HeroSection from '../components/HeroSection';
import TutorialSection from '../components/TutorialSection';
import FeatureShowcaseClean from '../components/FeatureShowcaseClean';
import TechStackShowcaseClean from '../components/TechStackShowcaseClean';
import SetupStepsShowcaseClean from '../components/SetupStepsShowcaseClean';
import CodeImplementationShowcase from '../components/CodeImplementationShowcase';
import PlaygroundSection from '../components/PlaygroundSection';
import RippleEffect from '../components/RippleEffect';
import { completeAuthContent } from '../data/completeAuthContent';
import { djangoCodeFiles } from '../data/djangoCodeFiles';
import { motion } from 'framer-motion';
import { Download, Github, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const containerRef = useScrollAnimations();

  useEffect(() => {
    // Update page title
    document.title = 'Complete Django Authentication System - Production Ready with MongoDB + MySQL';
  }, []);

  return (
    <div ref={containerRef} className="bg-gray-900 text-white overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        }}
      />
      
      {/* Ripple Effects */}
      <RippleEffect trigger=".ripple-button" color="rgba(59, 130, 246, 0.4)" size={120} />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {completeAuthContent.introduction.title}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
              {completeAuthContent.introduction.subtitle}
            </p>
            <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              {completeAuthContent.introduction.description}
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {completeAuthContent.introduction.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                >
                  <p className="text-gray-300">{feature}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                size="lg"
                className="ripple-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="ripple-button border-2 border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => window.open('/assets/auth.txt', '_blank')}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Code
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <FeatureShowcaseClean />

      {/* Tech Stack Showcase */}
      <TechStackShowcaseClean />

      {/* Setup Steps */}
      <SetupStepsShowcaseClean />

      {/* Project Structure */}
      <TutorialSection
        id="project-structure"
        title="Project Architecture"
        description="Complete file structure with detailed explanations"
        className="bg-gradient-to-br from-gray-900 to-indigo-900"
      >
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-3xl font-bold text-blue-400 mb-6">{completeAuthContent.projectStructure.title}</h3>
          <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
            {completeAuthContent.projectStructure.structure.map((item, index) => (
              <div key={index} className="mb-2">
                <span className="text-blue-400">{item.name}</span>
                {item.type === 'file' && item.description && (
                  <span className="text-gray-500 ml-4"># {item.description}</span>
                )}
              </div>
            ))}
          </pre>
        </div>
      </TutorialSection>

      {/* Complete Code Showcase */}
      <CodeImplementationShowcase />

      {/* API Endpoints */}
      <TutorialSection
        id="api-endpoints"
        title="Complete API Reference"
        description="All 13 API endpoints with detailed examples and curl commands"
        className="bg-gradient-to-br from-purple-900 to-gray-900"
      >
        <div className="grid gap-8">
          {completeAuthContent.apiEndpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 ripple-button"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  endpoint.method === 'POST' ? 'bg-green-500 text-white' : 
                  endpoint.method === 'DELETE' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-xl font-mono text-blue-400">{endpoint.endpoint}</code>
              </div>
              <p className="text-gray-300 mb-6 text-lg">{endpoint.description}</p>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <h5 className="font-semibold text-yellow-400 mb-3">Example Usage</h5>
                <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                  {endpoint.example}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </TutorialSection>

      {/* How It Works */}
      <TutorialSection
        id="how-it-works"
        title="How It All Works Together"
        description="Understanding the complete authentication flow in plain English"
        className="bg-gradient-to-br from-gray-900 to-blue-900"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {completeAuthContent.howItWorks.flows.map((flow, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-6">{flow.title}</h3>
              <ol className="space-y-4">
                {flow.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </TutorialSection>

      {/* Interactive Playground */}
      <PlaygroundSection />

      {/* Download Section */}
      <TutorialSection
        id="download"
        title="Get Started Now"
        description="Download the complete source code and start building your secure authentication system"
        className="bg-gradient-to-br from-gray-800 to-gray-900"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Button
              size="lg"
              className="ripple-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
              onClick={() => window.open('/assets/auth.txt', '_blank')}
            >
              <Download className="w-6 h-6 mr-3" />
              Download Complete Django Code
            </Button>
            <p className="text-gray-400 text-lg">
              Everything you need to build production-ready authentication with Django + MongoDB + MySQL
            </p>
          </motion.div>
        </div>
      </TutorialSection>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-lg">
            Built with Django REST Framework, MongoDB, MySQL, and spectacular GSAP animations
          </p>
          <p className="text-gray-500 mt-2">
            Secure • Scalable • Production-Ready • Spectacular
          </p>
        </div>
      </footer>
    </div>
  );
}