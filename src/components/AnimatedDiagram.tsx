import React from 'react';
import { motion } from 'framer-motion';
import { Database, Clock, Mail, Key, User, Trash2 } from 'lucide-react';

export const AnimatedDiagram: React.FC = () => {
  const collections = [
    {
      name: 'users',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      fields: ['_id', 'email', 'password_hash', 'is_verified', 'is_blacklisted', 'created_at', 'token_version'],
      description: 'Main user collection in MongoDB'
    },
    {
      name: 'otps',
      icon: Key,
      color: 'from-green-500 to-green-600',
      fields: ['_id', 'user_id', 'otp_hash', 'kind', 'expires_at', 'created_at'],
      description: 'OTP storage with automatic expiry (TTL: 10 minutes)'
    },
    {
      name: 'deleted_users',
      icon: Trash2,
      color: 'from-red-500 to-red-600',
      fields: ['_id', 'original_data', 'deleted_at', 'deleted_by'],
      description: 'Soft-deleted users for restoration'
    }
  ];

  const otpSteps = [
    { title: 'Generate', description: '6-digit random OTP', icon: Key },
    { title: 'Hash & Store', description: 'Secure hashing + MongoDB TTL', icon: Database },
    { title: 'Send Email', description: 'SMTP delivery to user', icon: Mail },
    { title: 'Auto-Expire', description: '10-minute automatic cleanup', icon: Clock }
  ];

  return (
    <div className="space-y-16">
      {/* Database Collections */}
      <div>
        <h3 className="text-3xl font-bold text-center mb-12 text-white">MongoDB Collections</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => {
            const Icon = collection.icon;
            return (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${collection.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2">{collection.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{collection.description}</p>
                
                <div className="space-y-2">
                  {collection.fields.map((field, fieldIndex) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.2) + (fieldIndex * 0.1) }}
                      viewport={{ once: true }}
                      className="bg-gray-900 rounded px-3 py-1 text-sm text-gray-300 font-mono"
                    >
                      {field}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* OTP Lifecycle Timeline */}
      <div className="otp-timeline">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">OTP Lifecycle Timeline</h3>
        
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 rounded-full transform -translate-y-1/2">
            <motion.div
              className="timeline-progress h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
            />
          </div>
          
          {/* Timeline steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {otpSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="timeline-step relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                    
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TTL Countdown Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">TTL: 10 minutes auto-expiry</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedDiagram;