'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginForm from '@/components/admin/LoginForm3D';
import { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in (you can implement session storage or similar)
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      const adminData = JSON.parse(storedAdmin);
      setAdmin(adminData);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (adminData: { username: string }) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && admin ? (
        <AdminDashboard admin={admin} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f97316',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
