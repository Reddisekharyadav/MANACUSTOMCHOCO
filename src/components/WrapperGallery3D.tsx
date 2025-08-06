'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Sparkles, Eye } from 'lucide-react';
import WrapperCard3D from './WrapperCard3D';
import Lightbox from './Lightbox';
import { Wrapper } from '@/types';
import toast from 'react-hot-toast';

const ITEMS_PER_SECTION = 7;

export default function WrapperGallery3D() {
  const [wrappers, setWrappers] = useState<Wrapper[]>([]);
  const [filteredWrappers, setFilteredWrappers] = useState<Wrapper[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWrapper, setSelectedWrapper] = useState<Wrapper | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const totalSections = Math.ceil(filteredWrappers.length / ITEMS_PER_SECTION);

  const getCurrentSectionItems = () => {
    const startIndex = currentSection * ITEMS_PER_SECTION;
    const endIndex = startIndex + ITEMS_PER_SECTION;
    return filteredWrappers.slice(startIndex, endIndex);
  };

  const navigateSection = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const scrollToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
  };

  useEffect(() => {
    const filtered = wrappers.filter(wrapper =>
      wrapper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wrapper.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wrapper.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWrappers(filtered);
    setCurrentSection(0);
  }, [searchTerm, wrappers]);

  const fetchWrappers = async () => {
    try {
      const response = await fetch('/api/wrappers');
      const data = await response.json();
      
      if (data.success) {
        setWrappers(data.wrappers);
        setFilteredWrappers(data.wrappers);
      } else {
        toast.error('Failed to load wrappers');
      }
    } catch {
      toast.error('Failed to load wrappers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWrappers();
  }, []);

  const handleLike = async (wrapperId: string) => {
    setWrappers(prev => prev.map(wrapper => 
      wrapper._id === wrapperId 
        ? { ...wrapper, likes: (wrapper.likes || 0) + 1 }
        : wrapper
    ));
    setFilteredWrappers(prev => prev.map(wrapper => 
      wrapper._id === wrapperId 
        ? { ...wrapper, likes: (wrapper.likes || 0) + 1 }
        : wrapper
    ));
  };

  const openLightbox = (wrapper: Wrapper) => {
    setSelectedWrapper(wrapper);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedWrapper(null);
  };

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 text-lg">Loading delicious wrappers...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.section 
      className="py-16 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden" 
      data-gallery="true"
      style={{ opacity, scale }}
    >
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-amber-300/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-300/20 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Chocolate Particles */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`gallery-chocolate-${i}`}
            className="absolute w-1.5 h-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-40"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, (i % 2 === 0 ? 25 : -25), 0],
              scale: [0.5, 1.2, 0.5],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 10 + (i % 4),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Sparkle Elements */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`gallery-sparkle-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -80, 0],
              rotate: [0, 360],
              scale: [0.8, 1.4, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 7 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
          </motion.div>
        ))}

        {/* Gradient Wave Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Heart Floaters */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`gallery-heart-${i}`}
            className="absolute text-red-300/30 text-lg"
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              y: [0, -200],
              x: [0, (i % 2 === 0 ? 30 : -30)],
              rotate: [0, 360],
              scale: [0.8, 1.5, 0],
              opacity: [0.3, 0.8, 0],
            }}
            transition={{
              duration: 18 + i * 2,
              repeat: Infinity,
              delay: i * 4,
              ease: "easeOut"
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🍫 Chocolate Wrapper Collection
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover our premium collection with <span className="font-bold text-amber-600">interactive 3D gallery</span>
          </motion.p>

          {/* Contact Banner */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold text-orange-600">📧 orders@manacustomchoco.com</span> • 
              <span className="font-semibold text-red-600 ml-2">📞 +91 9392215575</span>
            </p>
            <p className="text-gray-600">
              Select any model number and contact us to place your order!
            </p>
          </motion.div>
        </motion.div>

        {/* Enhanced Search */}
        <motion.div 
          className="mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="max-w-md mx-auto relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-white rounded-full shadow-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by model number, name, or description..."
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-gray-700 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Gallery Navigation */}
        {totalSections > 1 && (
          <motion.div 
            className="flex justify-center items-center mb-8 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.button
              onClick={() => navigateSection('prev')}
              disabled={currentSection === 0}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-amber-600" />
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalSections }, (_, index) => (
                <motion.button
                  key={`gallery-section-${index}`}
                  onClick={() => scrollToSection(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSection === index 
                      ? 'bg-amber-500 shadow-lg' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigateSection('next')}
              disabled={currentSection === totalSections - 1}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 text-amber-600" />
            </motion.button>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-gray-700 bg-white/60 backdrop-blur-sm rounded-full px-6 py-2 inline-block shadow-lg">
            <Eye className="inline w-4 h-4 mr-2" />
            Showing {getCurrentSectionItems().length} of {filteredWrappers.length} wrappers
            {totalSections > 1 && ` • Section ${currentSection + 1} of ${totalSections}`}
          </p>
        </motion.div>

        {/* 3D Horizontal Gallery */}
        <AnimatePresence mode="wait">
          {filteredWrappers.length > 0 ? (
            <motion.div
              key={currentSection}
              className="relative perspective-1000"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <motion.div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide pb-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <motion.div 
                  className="flex gap-8 px-4"
                  style={{ width: `${getCurrentSectionItems().length * 320 + (getCurrentSectionItems().length - 1) * 32}px` }}
                >
                  {getCurrentSectionItems().map((wrapper, index) => (
                    <motion.div
                      key={wrapper._id}
                      className="flex-shrink-0 w-80"
                      initial={{ 
                        opacity: 0, 
                        y: 100,
                        rotateY: 45,
                        scale: 0.8
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        rotateY: 0,
                        scale: 1
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        y: -20,
                        rotateY: 5,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <WrapperCard3D
                        wrapper={{
                          ...wrapper,
                          currentPrice: wrapper.price,
                          isLateNightActive: false
                        }}
                        onLike={handleLike}
                        onClick={() => openLightbox(wrapper)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl"
            >
              <motion.div 
                className="text-gray-400 mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Filter className="w-20 h-20 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No wrappers found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search terms to find the perfect wrapper</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox */}
        <Lightbox
          wrapper={selectedWrapper ? {
            ...selectedWrapper,
            currentPrice: selectedWrapper.price,
            isLateNightActive: false
          } : null}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onLike={handleLike}
        />
      </div>
    </motion.section>
  );
}
