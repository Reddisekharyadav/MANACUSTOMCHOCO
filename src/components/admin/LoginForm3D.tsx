'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onLogin: (admin: { username: string }) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Login successful!');
        onLogin(data.admin);
        // Store session in localStorage (in a real app, use secure cookies/JWT)
        localStorage.setItem('admin_session', JSON.stringify(data.admin));
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-amber-300/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-300/20 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Sparkles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`admin-sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home Link */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
            ← Back to Gallery
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0, rotateX: 30 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            className="relative mx-auto w-20 h-20 mb-6"
            whileHover={{ scale: 1.1, rotateY: 180 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(245, 158, 11, 0.4)",
                  "0 0 40px rgba(245, 158, 11, 0.8)",
                  "0 0 20px rgba(245, 158, 11, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Admin Portal
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Secure access to manage your collection
          </motion.p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ 
            scale: 1.02,
            rotateY: 2,
            transition: { duration: 0.3 }
          }}
        >
          {/* Card Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-red-400/10 rounded-3xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Username Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Administrator Username
              </label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 font-medium"
                  placeholder="Enter admin username"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Secure Password
              </label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 font-medium"
                  placeholder="Enter secure password"
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-0"
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
                
                {isLoading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Access Admin Dashboard
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Security Notice */}
          <motion.div 
            className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-sm text-red-700 text-center leading-relaxed">
              <strong className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                Secure Admin Access
              </strong>
              Only authorized personnel with valid credentials can access the admin panel.
              <br />
              <span className="text-red-600 font-medium">Contact the system administrator for access.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
