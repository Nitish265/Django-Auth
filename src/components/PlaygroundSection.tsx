import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Lock, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface APIResponse {
  success: boolean;
  message: string;
  user_id?: string;
  email?: string;
  is_verified?: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    is_verified: boolean;
  };
}

export const PlaygroundSection: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'signup' | 'verify' | 'login'>('signup');
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'securepassword123',
    otp: '123456',
    userId: '64a1b2c3d4e5f6789012345'
  });
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const simulateAPICall = async (endpoint: string, payload: Record<string, string>) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on endpoint
    const mockResponses: Record<string, APIResponse> = {
      '/api/auth/signup/': {
        success: true,
        message: 'User created successfully! Please verify your email.',
        user_id: '64a1b2c3d4e5f6789012345',
        email: payload.email
      },
      '/api/auth/verify-otp/': {
        success: true,
        message: 'Email verified successfully!',
        is_verified: true,
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGc...'
      },
      '/api/auth/login/': {
        success: true,
        message: 'Login successful!',
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
        refresh_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
        user: {
          id: '64a1b2c3d4e5f6789012345',
          email: payload.email,
          is_verified: true
        }
      }
    };

    const mockResponse = mockResponses[endpoint];
    setResponse(mockResponse);
    setLoading(false);
    
    if (mockResponse.success) {
      toast.success(mockResponse.message);
    } else {
      toast.error('Something went wrong!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const endpoints = {
      signup: '/api/auth/signup/',
      verify: '/api/auth/verify-otp/',
      login: '/api/auth/login/'
    };
    
    const payloads = {
      signup: { email: formData.email, password: formData.password },
      verify: { user_id: formData.userId, otp: formData.otp },
      login: { email: formData.email, password: formData.password }
    };
    
    simulateAPICall(endpoints[activeFlow], payloads[activeFlow]);
  };

  const flows = [
    { id: 'signup', label: 'Sign Up', icon: User },
    { id: 'verify', label: 'Verify OTP', icon: Key },
    { id: 'login', label: 'Login', icon: Lock }
  ];

  return (
    <section className="playground-section min-h-screen py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Interactive Playground
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test the authentication flows with our interactive demo. See real API responses and understand the complete user journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="playground-form"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Try It Out</CardTitle>
                <div className="flex space-x-2 mt-4">
                  {flows.map((flow) => {
                    const Icon = flow.icon;
                    return (
                      <Button
                        key={flow.id}
                        variant={activeFlow === flow.id ? "default" : "outline"}
                        onClick={() => setActiveFlow(flow.id as 'signup' | 'verify' | 'login')}
                        className="flex items-center space-x-2"
                      >
                        <Icon size={16} />
                        <span>{flow.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(activeFlow === 'signup' || activeFlow === 'login') && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeFlow === 'verify' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">User ID</label>
                        <Input
                          value={formData.userId}
                          onChange={(e) => setFormData({...formData, userId: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="User ID from signup response"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">OTP Code</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            value={formData.otp}
                            onChange={(e) => setFormData({...formData, otp: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send size={16} />
                        <span>
                          {activeFlow === 'signup' && 'Create Account'}
                          {activeFlow === 'verify' && 'Verify Email'}
                          {activeFlow === 'login' && 'Sign In'}
                        </span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="playground-response"
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-white">API Response</CardTitle>
              </CardHeader>
              <CardContent>
                {response ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                    <div className="text-sm text-gray-400">
                      Response received in ~1.2s
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Send size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Submit a form to see the API response</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlaygroundSection;