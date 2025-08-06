'use client';

import { motion } from 'framer-motion';
import { Heart, Copy, Mail, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Wrapper } from '@/types';
import toast from 'react-hot-toast';

interface WrapperCardProps {
  wrapper: Wrapper & { currentPrice: number; isLateNightActive?: boolean };
  onLike: (id: string) => void;
  onClick: () => void;
}

export default function WrapperCard({ wrapper, onLike, onClick }: WrapperCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [modelCopied, setModelCopied] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wrapperId: wrapper._id })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsLiked(data.liked);
        onLike(wrapper._id!);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const copyModelNumber = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(wrapper.modelNumber);
      setModelCopied(true);
      toast.success(`Model ${wrapper.modelNumber} copied!`);
      setTimeout(() => setModelCopied(false), 2000);
    } catch {
      toast.error('Failed to copy model number');
    }
  };

  const handleEmailOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = `Order Request - Model ${wrapper.modelNumber}`;
    const body = `Hi ManaCustom Choco,

I would like to order the following wrapper:
- Model Number: ${wrapper.modelNumber}
- Design Name: ${wrapper.name}
- Price: ${formatPrice(wrapper.currentPrice)}

Please let me know the next steps for placing this order.

Thank you!`;
    
    const mailtoLink = `mailto:orders@manacustomchoco.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden cursor-pointer relative group"
      onClick={onClick}
      initial={{ opacity: 0, y: 50, rotateY: 20 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 8,
        rotateX: 5,
        z: 50,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
      layout
    >
      {/* Enhanced Card Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-orange-400/30 to-red-400/30 rounded-3xl opacity-0"
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: 1,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      />

      {/* Floating Sparkles on Hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`card-sparkle-${wrapper._id}-${i}`}
            className="absolute opacity-0 group-hover:opacity-100"
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
          </motion.div>
        ))}
      </div>

      {/* Model Number Badge with Enhanced 3D Effect */}
      <motion.div 
        className="absolute top-4 left-4 z-20"
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        whileHover={{ 
          scale: 1.15,
          rotateZ: 8,
          y: -5,
          transition: { duration: 0.2 }
        }}
      >
        <motion.button
          onClick={copyModelNumber}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl relative overflow-hidden group/badge"
          whileHover={{
            boxShadow: "0 10px 30px rgba(245, 158, 11, 0.6)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover/badge:opacity-40"
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            {wrapper.modelNumber}
            {modelCopied ? (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-green-200"
              >
                ✓
              </motion.span>
            ) : (
              <Copy className="w-3 h-3 opacity-70 group-hover/badge:opacity-100 transition-opacity" />
            )}
          </span>
        </motion.button>
      </motion.div>

      {/* Late Night Special Badge */}
      {wrapper.isLateNightActive && (
        <motion.div 
          className="absolute top-4 right-4 z-20"
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
            🌙 Late Night Special
          </div>
        </motion.div>
      )}

      {/* Enhanced Image Container */}
      <motion.div 
        className="relative aspect-[4/3] overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={wrapper.imageUrl}
          alt={wrapper.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          sizes="320px"
        />
        
        {/* Enhanced Overlay with Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        />

        {/* Floating Like Button */}
        <motion.button
          whileHover={{ 
            scale: 1.2,
            rotate: 10,
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)"
          }}
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-md'
          }`}
          disabled={isLiking}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {isLiking ? (
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          )}
        </motion.button>
      </motion.div>

      {/* Enhanced Content Section */}
      <motion.div 
        className="p-6 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h3 
          className="font-bold text-xl text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          {wrapper.name}
        </motion.h3>
        
        {wrapper.description && (
          <motion.p 
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {wrapper.description}
          </motion.p>
        )}

        {/* Enhanced Price and Like Section */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="text-right"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {formatPrice(wrapper.currentPrice)}
            </p>
            {wrapper.isLateNightActive && wrapper.price !== wrapper.currentPrice && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(wrapper.price)}
              </p>
            )}
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-1 text-gray-500"
            whileHover={{ scale: 1.1 }}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{wrapper.likes || 0}</span>
          </motion.div>
        </div>

        {/* Enhanced Order Button */}
        <motion.button
          onClick={handleEmailOrder}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group/btn"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover/btn:opacity-30"
            transition={{ duration: 0.3 }}
          />
          <Mail className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Order Now</span>
        </motion.button>

        {/* Tags */}
        {wrapper.tags && wrapper.tags.length > 0 && (
          <motion.div 
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {wrapper.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1, backgroundColor: "#fef3c7" }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div 
          className="mt-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-gray-500 text-center">
            📧 orders@manacustomchoco.com • 📞 +91 9392215575
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
