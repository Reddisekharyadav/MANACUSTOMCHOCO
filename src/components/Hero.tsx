'use client';

import { motion } from 'framer-motion';
import { Sparkles, Clock, Star, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToGallery = () => {
    const galleryElement = document.querySelector('[data-gallery="true"]');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const sparkleAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Enhanced Background Pattern with More Animations */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-amber-300 rounded-full blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300 rounded-full blur-3xl"
          animate={{
            y: [10, -10, 10],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-200 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Floating Mini Chocolates */}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={`hero-mini-chocolate-${i}`}
            className="absolute w-1.5 h-1.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              scale: [0.5, 1.2, 0.5],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 8 + (i % 3),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut" as const
            }}
          />
        ))}
        
        {/* Floating Sparkles */}
        <motion.div className="absolute top-32 left-1/4" animate={sparkleAnimation}>
          <Sparkles className="w-6 h-6 text-amber-400" />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-1/4" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 1 
            }
          }}
        >
          <Star className="w-5 h-5 text-orange-400" />
        </motion.div>
        <motion.div 
          className="absolute top-1/3 right-1/3" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 2 
            }
          }}
        >
          <Sparkles className="w-4 h-4 text-red-400" />
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Enhanced Logo with Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div 
            className="relative mx-auto w-36 h-36 md:w-44 md:h-44 mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
              <div className="text-white font-bold text-2xl md:text-3xl text-center">
                <div>MANA</div>
                <div className="text-lg md:text-xl">🍫</div>
                <div className="text-sm md:text-base">CHOCO</div>
              </div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-red-500/20 rounded-full"
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              ></motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            MANACUSTOM
          </motion.h1>
          <motion.div 
            className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            CHOCO
          </motion.div>
        </motion.div>

        {/* Enhanced Tagline */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          Explore our <span className="font-semibold text-amber-600">exclusive collection</span> of custom chocolate wrappers. 
          <br className="hidden md:block" />
          Find your perfect design by <span className="font-semibold text-orange-600">model number</span> and contact us to order!
        </motion.p>

        {/* Contact Information */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Ordering Process</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-center justify-center gap-2">
              <span className="bg-amber-100 p-2 rounded-full">
                <span className="text-amber-600 font-bold">1</span>
              </span>
              <span>Browse Gallery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-orange-100 p-2 rounded-full">
                <span className="text-orange-600 font-bold">2</span>
              </span>
              <span>Note Model Number</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-red-100 p-2 rounded-full">
                <span className="text-red-600 font-bold">3</span>
              </span>
              <span>Contact Us</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <motion.a
            href="mailto:orders@manacustomchoco.com"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            orders@manacustomchoco.com
          </motion.a>
          <motion.a
            href="tel:+919392215575"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-5 h-5" />
            +91 9392215575
          </motion.a>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <div className="flex items-center space-x-2 bg-white bg-opacity-80 px-4 py-2 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-gray-700 font-medium">Premium Quality</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-80 px-4 py-2 rounded-full backdrop-blur-sm">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-gray-700 font-medium">Fully Customizable</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-80 px-4 py-2 rounded-full backdrop-blur-sm">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-gray-700 font-medium">Fast Delivery</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <button 
            onClick={scrollToGallery}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            Explore Our Gallery <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Late Night Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
            <span>🌙</span>
            <span>Late Night Specials Available After 10 PM IST</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
