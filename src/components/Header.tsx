'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Menu, X, Home, Phone, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    // Check if user/admin is logged in
    const admin = localStorage.getItem('admin');
    const user = localStorage.getItem('user');
    
    if (admin) {
      setIsLoggedIn(true);
      setUserType('admin');
    } else if (user) {
      setIsLoggedIn(true);
      setUserType('user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserType(null);
    window.location.href = '/';
  };

  const scrollToGallery = () => {
    const galleryElement = document.querySelector('[data-gallery="true"]');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
              <Image 
                src="/uploads/logo.jpg" 
                alt="ManaCustom Choco Logo" 
                width={40} 
                height={40}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-white font-bold text-xs">🍫</span>';
                  }
                }}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ManaCustom Choco
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button 
              onClick={scrollToGallery}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              Gallery
            </button>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            
            {/* Login/User Section */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {userType === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">
                    {userType === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link
                    href="/admin"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm hover:from-amber-600 hover:to-orange-600 transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 py-4 overflow-hidden"
            >
              <div className="space-y-4">
                <Link 
                  href="/" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <button 
                  onClick={scrollToGallery}
                  className="block text-gray-700 hover:text-amber-600 transition-colors text-left"
                >
                  Gallery
                </button>
                <Link 
                  href="/contact" 
                  className="block text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="w-4 h-4" />
                  Contact
                </Link>
                
                <div className="border-t border-gray-200 pt-4">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      {userType === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="block text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout ({userType})
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        className="block text-gray-700 hover:text-amber-600 transition-colors flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        User Login
                      </Link>
                      <Link
                        href="/admin"
                        className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-center hover:from-amber-600 hover:to-orange-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
