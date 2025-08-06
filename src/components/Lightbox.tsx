'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Mail, Copy } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Wrapper } from '@/types';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface LightboxProps {
  wrapper: (Wrapper & { currentPrice: number; isLateNightActive?: boolean }) | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
}

export default function Lightbox({ wrapper, isOpen, onClose, onLike }: LightboxProps) {
  const [modelCopied, setModelCopied] = useState(false);
  
  if (!wrapper) return null;

  const handleLike = async () => {
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wrapperId: wrapper._id })
      });

      const data = await response.json();
      
      if (data.success) {
        onLike(wrapper._id!);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to update like status');
    }
  };

  const copyModelNumber = async () => {
    try {
      await navigator.clipboard.writeText(wrapper.modelNumber);
      setModelCopied(true);
      toast.success(`Model ${wrapper.modelNumber} copied!`);
      setTimeout(() => setModelCopied(false), 2000);
    } catch {
      toast.error('Failed to copy model number');
    }
  };

  const handleEmailOrder = () => {
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

  const handleShare = () => {
    const shareText = `Check out this beautiful chocolate wrapper design: ${wrapper.name} (Model: ${wrapper.modelNumber}) - ${formatPrice(wrapper.currentPrice)}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${wrapper.name} - Model ${wrapper.modelNumber}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-75" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-red-50 transition-colors"
              >
                <Heart className="w-5 h-5 text-red-500" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[90vh]">
              {/* Image */}
              <div className="relative flex-1 min-h-[300px] lg:min-h-[500px]">
                <Image
                  src={wrapper.imageUrl}
                  alt={wrapper.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                
                {/* Late Night Badge */}
                {wrapper.isLateNightActive && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    🌙 Late Night Special
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-6 lg:p-8 lg:max-w-md">
                {/* Model Number Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-amber-700">MODEL</span>
                    <span className="font-bold text-xl text-amber-800">{wrapper.modelNumber}</span>
                    <button
                      onClick={copyModelNumber}
                      className="text-amber-600 hover:text-amber-800 transition-colors"
                      title="Copy model number"
                    >
                      {modelCopied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {wrapper.name}
                </h2>
                
                {wrapper.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {wrapper.description}
                  </p>
                )}

                {/* Pricing */}
                <div className="mb-6">
                  {wrapper.isLateNightActive && wrapper.lateNightPrice && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(wrapper.price)}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                        SAVE {formatPrice(wrapper.price - wrapper.lateNightPrice)}
                      </span>
                    </div>
                  )}
                  <div className={`text-3xl font-bold ${
                    wrapper.isLateNightActive ? 'text-purple-600' : 'text-amber-600'
                  }`}>
                    {formatPrice(wrapper.currentPrice)}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-6 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{wrapper.likes} likes</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEmailOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    📧 Email Order for Model {wrapper.modelNumber}
                  </motion.button>
                  
                  <button 
                    onClick={handleLike}
                    className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Add to Favorites
                  </button>
                </div>

                {/* Order Instructions */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">📧 How to Order:</h4>
                  <ol className="text-sm text-amber-700 space-y-1">
                    <li>1. Click &ldquo;Email Order&rdquo; button above</li>
                    <li>2. Model number will be included automatically</li>
                    <li>3. Add any customization details</li>
                    <li>4. Send the email and we&apos;ll contact you!</li>
                  </ol>
                  <p className="text-xs text-amber-600 mt-2">
                    💬 WhatsApp: +91 9392215575 | 📧 orders@manacustomchoco.com
                  </p>
                </div>

                {/* Features */}
                <div className="mt-6 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div>✨ Premium quality materials</div>
                    <div>🎨 Fully customizable design</div>
                    <div>📦 Fast delivery available</div>
                    <div>💝 Perfect for special occasions</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
