'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Eye, 
  LogOut, 
  BarChart3, 
  Calendar,
  Heart,
  Package,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import UploadForm from './UploadForm';
import { Wrapper } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  readonly admin: { username: string };
  readonly onLogout: () => void;
}

interface EditingWrapper {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

export default function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'wrappers' | 'analytics'>('upload');
  const [wrappers, setWrappers] = useState<Wrapper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingWrapper, setEditingWrapper] = useState<EditingWrapper | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'wrappers' || activeTab === 'analytics') {
      fetchWrappers();
    }
  }, [activeTab]);

  const fetchWrappers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wrappers?includeScheduled=true');
      const data = await response.json();
      
      if (data.success) {
        setWrappers(data.wrappers);
      } else {
        toast.error('Failed to load wrappers');
      }
    } catch {
      toast.error('Failed to load wrappers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWrapper = (wrapper: Wrapper) => {
    setEditingWrapper({
      _id: wrapper._id!,
      name: wrapper.name,
      price: wrapper.price,
      description: wrapper.description || ''
    });
  };

  const handleSaveWrapper = async () => {
    if (!editingWrapper) return;

    try {
      const response = await fetch('/api/wrappers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingWrapper)
      });

      const data = await response.json();
      
      if (data.success) {
        setWrappers(prev => prev.map(w => 
          w._id === editingWrapper._id 
            ? { ...w, ...editingWrapper }
            : w
        ));
        setEditingWrapper(null);
        toast.success('Wrapper updated successfully!');
      } else {
        toast.error('Failed to update wrapper');
      }
    } catch {
      toast.error('Failed to update wrapper');
    }
  };

  const handleDeleteWrapper = async (wrapperId: string) => {
    if (!confirm('Are you sure you want to delete this wrapper?')) return;

    try {
      const response = await fetch(`/api/wrappers?id=${wrapperId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setWrappers(prev => prev.filter(w => w._id !== wrapperId));
        toast.success('Wrapper deleted successfully!');
      } else {
        toast.error('Failed to delete wrapper');
      }
    } catch {
      toast.error('Failed to delete wrapper');
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleUploadSuccess = () => {
    setActiveTab('wrappers');
    fetchWrappers();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    onLogout();
    toast.success('Logged out successfully');
  };

  // Analytics calculations
  const totalWrappers = wrappers.length;
  const totalLikes = wrappers.reduce((sum, wrapper) => sum + (wrapper.likes || 0), 0);
  const averagePrice = wrappers.length > 0 
    ? wrappers.reduce((sum, wrapper) => sum + wrapper.price, 0) / wrappers.length 
    : 0;
  const scheduledWrappers = wrappers.filter(w => w.scheduledDate && new Date(w.scheduledDate) > new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <span className="ml-3 text-sm text-gray-500">
                Welcome, {admin.username}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('wrappers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'wrappers'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Manage Wrappers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' && (
            <UploadForm onSuccess={handleUploadSuccess} />
          )}

          {activeTab === 'wrappers' && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Wrapper Management
                </h3>
                <p className="text-gray-600 mt-1">
                  View and manage all uploaded wrappers
                </p>
              </div>

              {isLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {wrappers.map((wrapper) => (
                    <div key={wrapper._id} className="p-6">
                      {editingWrapper?._id === wrapper._id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={wrapper.imageUrl}
                              alt={wrapper.name}
                              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleViewImage(wrapper.imageUrl)}
                            />
                            <div className="flex-1 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Wrapper Name
                                </label>
                                <input
                                  type="text"
                                  value={editingWrapper?.name || ''}
                                  onChange={(e) => editingWrapper && setEditingWrapper({
                                    ...editingWrapper,
                                    name: e.target.value
                                  })}
                                  placeholder="Enter wrapper name"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                              <div>
                                <label htmlFor="price-input" className="block text-sm font-medium text-gray-700 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  id="price-input"
                                  type="number"
                                  value={editingWrapper?.price || 0}
                                  onChange={(e) => editingWrapper && setEditingWrapper({
                                    ...editingWrapper,
                                    price: parseFloat(e.target.value) || 0
                                  })}
                                  placeholder="Enter price"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                              <div>
                                <label htmlFor="description-input" className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  id="description-input"
                                  value={editingWrapper?.description || ''}
                                  onChange={(e) => editingWrapper && setEditingWrapper({
                                    ...editingWrapper,
                                    description: e.target.value
                                  })}
                                  rows={3}
                                  placeholder="Enter description"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 pt-4">
                            <button
                              onClick={handleSaveWrapper}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingWrapper(null)}
                              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center space-x-4">
                          <img
                            src={wrapper.imageUrl}
                            alt={wrapper.name}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleViewImage(wrapper.imageUrl)}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium text-gray-900 truncate">
                              {wrapper.name}
                            </h4>
                            <p className="text-amber-600 font-semibold text-sm">
                              Model: {wrapper.modelNumber}
                            </p>
                            {wrapper.description && (
                              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                {wrapper.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {formatPrice(wrapper.price)}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {wrapper.likes || 0}
                              </span>
                              {wrapper.scheduledDate && (
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(new Date(wrapper.scheduledDate))}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {wrapper.scheduledDate && new Date(wrapper.scheduledDate) > new Date() && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Scheduled
                              </span>
                            )}
                            {wrapper.isLateNightSpecial && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                Late Night
                              </span>
                            )}
                            <button
                              onClick={() => handleViewImage(wrapper.imageUrl)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View Image"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditWrapper(wrapper)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="Edit Wrapper"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWrapper(wrapper._id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Wrapper"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {wrappers.length === 0 && (
                    <div className="p-12 text-center">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No wrappers yet
                      </h3>
                      <p className="text-gray-500">
                        Upload your first wrapper to get started
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Package className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Wrappers</p>
                      <p className="text-2xl font-bold text-gray-900">{totalWrappers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Likes</p>
                      <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(averagePrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Scheduled</p>
                      <p className="text-2xl font-bold text-gray-900">{scheduledWrappers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Recent Wrappers
                  </h3>
                </div>
                <div className="p-6">
                  {wrappers.slice(0, 5).map((wrapper) => (
                    <div key={wrapper._id} className="flex items-center space-x-4 py-3">
                      <img
                        src={wrapper.imageUrl}
                        alt={wrapper.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{wrapper.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(wrapper.createdAt))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(wrapper.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {wrapper.likes} likes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Wrapper preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
