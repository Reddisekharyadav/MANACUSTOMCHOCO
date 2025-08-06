'use client';

import Hero from '@/components/Hero';
import WrapperGallery3D from '@/components/WrapperGallery3D';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <motion.main 
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Global Background Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 via-red-50 to-pink-50"
          animate={{
            background: [
              "linear-gradient(45deg, #fef3c7, #fed7aa, #fecaca, #fce7f3)",
              "linear-gradient(135deg, #fed7aa, #fecaca, #fce7f3, #fef3c7)",
              "linear-gradient(225deg, #fecaca, #fce7f3, #fef3c7, #fed7aa)",
              "linear-gradient(315deg, #fce7f3, #fef3c7, #fed7aa, #fecaca)",
              "linear-gradient(45deg, #fef3c7, #fed7aa, #fecaca, #fce7f3)"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Large Floating Orbs */}
        <motion.div 
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-amber-300/10 to-orange-300/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -100, 0],
            x: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-red-300/10 to-pink-300/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, 80, 0],
            x: [0, -40, 0],
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/10 to-yellow-300/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -60, 0],
            x: [0, 60, 0],
            scale: [1, 1.15, 1],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        />

        {/* Floating Chocolate Particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`global-chocolate-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-30"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
            }}
            animate={{
              y: [0, -300, 0],
              x: [0, (i % 2 === 0 ? 100 : -100), 0],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 15 + (i % 5),
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Sparkle Elements */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`global-sparkle-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 6}%`,
              top: `${15 + i * 6}%`,
            }}
            animate={{
              y: [0, -200, 0],
              rotate: [0, 360, 720],
              scale: [0.5, 1.8, 0.5],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 12 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>
        ))}

        {/* Heart Floaters */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`global-heart-${i}`}
            className="absolute text-red-300/40 text-2xl"
            style={{
              left: `${20 + i * 12}%`,
              top: `${25 + i * 10}%`,
            }}
            animate={{
              y: [0, -400],
              x: [0, (i % 2 === 0 ? 50 : -50)],
              rotate: [0, 360],
              scale: [0.8, 2, 0],
              opacity: [0.4, 0.8, 0],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeOut"
            }}
          >
            <Heart className="fill-current" />
          </motion.div>
        ))}

        {/* Rotating Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 border-2 border-amber-200/20 rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 border-2 border-orange-200/20 rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-red-200/20 rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Wave Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Pulsing Dots */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`global-dot-${i}`}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + i * 7}%`,
            }}
            animate={{
              scale: [1, 3, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <WrapperGallery3D />
        <Toaster />
      </div>
    </motion.main>
  );
}
