'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3x3, List, RefreshCw } from 'lucide-react';
import WrapperCard from './WrapperCard';
import Lightbox from './Lightbox';
import { Wrapper } from '@/types';
import toast from 'react-hot-toast';

export default function WrapperGallery() {
  const [wrappers, setWrappers] = useState<(Wrapper & { currentPrice: number; isLateNightActive?: boolean })[]>([]);
  const [filteredWrappers, setFilteredWrappers] = useState<(Wrapper & { currentPrice: number; isLateNightActive?: boolean })[]>([]);
  const [selectedWrapper, setSelectedWrapper] = useState<(Wrapper & { currentPrice: number; isLateNightActive?: boolean }) | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLateNight, setIsLateNight] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchWrappers();
    
    // Set up auto-refresh every 30 seconds to catch new wrappers
    const interval = setInterval(fetchWrappers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = wrappers.filter(wrapper =>
      wrapper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wrapper.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wrapper.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWrappers(filtered);
  }, [searchTerm, wrappers]);

  const fetchWrappers = async () => {
    try {
      const response = await fetch('/api/wrappers');
      const data = await response.json();
      
      if (data.success) {
        setWrappers(data.wrappers);
        setFilteredWrappers(data.wrappers);
        setIsLateNight(data.isLateNight);
      } else {
        toast.error('Failed to load wrappers');
      }
    } catch {
      toast.error('Failed to load wrappers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (wrapperId: string) => {
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

  const openLightbox = (wrapper: Wrapper & { currentPrice: number; isLateNightActive?: boolean }) => {
    setSelectedWrapper(wrapper);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedWrapper(null);
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-responsive loading skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`loading-${i}`} 
                className="bg-gray-200 rounded-xl aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
          {/* Loading text */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading delicious wrappers...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 px-3 sm:px-4 lg:px-6 bg-gray-50" data-gallery="true">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2"
          >
            🍫 Explore Our Wrapper Collection
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-3xl mx-auto px-2"
          >
            Browse our beautiful collection of custom chocolate wrappers. Each design has a unique model number for easy ordering.
            <br className="hidden sm:block" />
            <span className="font-semibold text-amber-600">Simply note the model number and email us to place your order!</span>
          </motion.p>
          
          {/* Contact Banner - Mobile Optimized */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
              <a 
                href="mailto:orders@manacustomchoco.com"
                className="text-amber-800 font-medium text-sm sm:text-base hover:text-amber-900 transition-colors"
              >
                📧 <span className="font-bold">orders@manacustomchoco.com</span>
              </a>
              <span className="hidden sm:inline text-amber-700">|</span>
              <a 
                href="tel:+919392215575"
                className="text-amber-800 font-medium text-sm sm:text-base hover:text-amber-900 transition-colors"
              >
                📞 <span className="font-bold">+91 9392215575</span>
              </a>
            </div>
            <p className="text-amber-700 text-xs sm:text-sm mt-2">
              Include the model number in your email for quick processing!
            </p>
          </motion.div>

          {/* Late Night Banner - Mobile Optimized */}
          {isLateNight && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-center"
            >
              <span className="text-sm sm:text-base lg:text-lg font-semibold">🌙 Late Night Specials Active! Enjoy discounted prices!</span>
            </motion.div>
          )}
        </div>

        {/* Controls - Mobile First Design */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search wrappers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Mode Toggle & Refresh - Centered on mobile */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => {
                    setIsLoading(true);
                    fetchWrappers();
                    toast.success('Gallery refreshed!');
                  }}
                  title="Refresh gallery"
                  className="p-2 sm:p-2.5 rounded-md transition-all duration-200 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-amber-600"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                  className={`p-2 sm:p-2.5 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List view"
                  className={`p-2 sm:p-2.5 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
            Showing <span className="font-semibold">{filteredWrappers.length}</span> of <span className="font-semibold">{wrappers.length}</span> wrappers
          </p>
        </div>

        {/* Gallery Grid - Responsive Design */}
        {filteredWrappers.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {filteredWrappers.map((wrapper, index) => (
              <motion.div
                key={wrapper._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className="w-full"
              >
                <WrapperCard
                  wrapper={wrapper}
                  onLike={handleLike}
                  onClick={() => openLightbox(wrapper)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No wrappers found</h3>
            <p className="text-sm sm:text-base text-gray-500">Try adjusting your search terms</p>
          </motion.div>
        )}

        {/* Lightbox */}
        <Lightbox
          wrapper={selectedWrapper}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onLike={handleLike}
        />
      </div>
    </section>
  );
}
