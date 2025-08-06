'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Late Night Special Badge */}
      {wrapper.isLateNightActive && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          🌙 Late Night Special
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={wrapper.imageUrl}
          alt={wrapper.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white bg-opacity-90 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          disabled={isLiking}
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} 
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Model Number Badge */}
        <div className="flex items-center justify-between mb-3">
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 rounded-full cursor-pointer hover:from-amber-200 hover:to-orange-200 transition-colors"
            onClick={copyModelNumber}
            title={`Copy model number ${wrapper.modelNumber}`}
          >
            <span className="text-xs font-medium text-amber-700">MODEL</span>
            <span className="font-bold text-amber-800">{wrapper.modelNumber}</span>
            {modelCopied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-600"
              >
                ✓
              </motion.div>
            ) : (
              <div className="text-amber-600 text-xs">📋</div>
            )}
          </button>
          
          {/* Quick Order Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEmailOrder}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1"
          >
            📧 Order
          </motion.button>
        </div>

        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {wrapper.name}
        </h3>
        
        {wrapper.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {wrapper.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {wrapper.isLateNightActive && wrapper.lateNightPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(wrapper.price)}
              </span>
            )}
            <span className={`font-bold text-lg ${
              wrapper.isLateNightActive ? 'text-purple-600' : 'text-amber-600'
            }`}>
              {formatPrice(wrapper.currentPrice)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{wrapper.likes || 0}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            📧 Email model <span className="font-semibold text-amber-600">{wrapper.modelNumber}</span> to order
          </p>
        </div>
      </div>
    </motion.div>
  );
}
