'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Calendar, Tag, DollarSign, Moon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface UploadFormProps {
  readonly onSuccess: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isLateNightSpecial: false,
    lateNightPrice: '',
    scheduledDate: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedModelNumber, setGeneratedModelNumber] = useState<string | null>(null);
  const [nextModelNumber, setNextModelNumber] = useState<string>('MC001');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the next model number when component mounts
  const fetchNextModelNumber = async () => {
    try {
      const response = await fetch('/api/wrappers');
      const data = await response.json();
      
      if (data.success && data.wrappers) {
        const modelNumbers = data.wrappers
          .map((w: { modelNumber: string }) => w.modelNumber)
          .filter((mn: string) => mn?.startsWith('MC'))
          .map((mn: string) => parseInt(mn.substring(2)))
          .filter((num: number) => !isNaN(num));
        
        const nextNumber = modelNumbers.length > 0 ? Math.max(...modelNumbers) + 1 : 1;
        setNextModelNumber(`MC${nextNumber.toString().padStart(3, '0')}`);
      }
    } catch (error) {
      console.error('Failed to fetch next model number:', error);
    }
  };

  // Fetch next model number on component mount
  useEffect(() => {
    fetchNextModelNumber();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.name || !formData.price) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsUploading(true);

    try {
      // First upload the image
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        toast.error(uploadData.message);
        return;
      }

      // Then create the wrapper
      const wrapperFormData = new FormData();
      wrapperFormData.append('name', formData.name);
      wrapperFormData.append('description', formData.description);
      wrapperFormData.append('price', formData.price);
      wrapperFormData.append('imageUrl', uploadData.imageUrl);
      wrapperFormData.append('isLateNightSpecial', formData.isLateNightSpecial.toString());
      
      if (formData.lateNightPrice) {
        wrapperFormData.append('lateNightPrice', formData.lateNightPrice);
      }
      
      if (formData.scheduledDate) {
        wrapperFormData.append('scheduledDate', formData.scheduledDate);
      }

      const wrapperResponse = await fetch('/api/wrappers', {
        method: 'POST',
        body: wrapperFormData
      });

      const wrapperData = await wrapperResponse.json();
      
      if (wrapperData.success) {
        const modelNumber = wrapperData.modelNumber;
        setGeneratedModelNumber(modelNumber);
        toast.success(`Wrapper uploaded successfully! Model Number: ${modelNumber}`);
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          isLateNightSpecial: false,
          lateNightPrice: '',
          scheduledDate: ''
        });
        setSelectedFile(null);
        setPreview(null);
        setGeneratedModelNumber(null); // Reset model number for next upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Fetch next model number for the new upload
        setTimeout(() => {
          fetchNextModelNumber();
        }, 1000);
        onSuccess();
      } else {
        toast.error(wrapperData.message);
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-amber-500" />
        Upload New Wrapper
      </h3>

      {/* Next Model Number Preview */}
      {!generatedModelNumber && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium mb-1">📋 Next Model Number</p>
              <p className="text-lg font-bold text-blue-800">
                <span className="text-amber-600">{nextModelNumber}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This model number will be automatically assigned to your wrapper
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Model Number Display */}
      {generatedModelNumber && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium mb-1">✅ Upload Successful!</p>
              <p className="text-lg font-bold text-green-800">
                Model Number: <span className="text-amber-600">{generatedModelNumber}</span>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Customers can use this model number to place orders
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label htmlFor="wrapper-image" className="block text-sm font-medium text-gray-700 mb-2">
            Wrapper Image *
          </label>
          <div
            role="button"
            tabIndex={0}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {preview ? (
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div>
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Click to upload wrapper image</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="wrapper-image"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wrapper-name" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Wrapper Name *
            </label>
            <input
              id="wrapper-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Happy Birthday Moksha"
              required
            />
          </div>

          <div>
            <label htmlFor="wrapper-price" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price (₹) *
            </label>
            <input
              id="wrapper-price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., 150"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="wrapper-description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="wrapper-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={3}
            placeholder="Describe this wrapper design..."
          />
        </div>

        {/* Late Night Special */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="lateNightSpecial"
              checked={formData.isLateNightSpecial}
              onChange={(e) => setFormData({ ...formData, isLateNightSpecial: e.target.checked })}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="lateNightSpecial" className="text-sm font-medium text-gray-700 flex items-center">
              <Moon className="w-4 h-4 mr-2 text-purple-500" />
              Enable Late Night Special
            </label>
          </div>

          {formData.isLateNightSpecial && (
            <div>
              <label htmlFor="late-night-price" className="block text-sm font-medium text-gray-700 mb-2">
                Late Night Price (₹)
              </label>
              <input
                id="late-night-price"
                type="number"
                value={formData.lateNightPrice}
                onChange={(e) => setFormData({ ...formData, lateNightPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., 120"
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>

        {/* Scheduling */}
        <div>
          <label htmlFor="scheduled-date" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Schedule Publication (Optional)
          </label>
          <input
            id="scheduled-date"
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Wrapper</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
