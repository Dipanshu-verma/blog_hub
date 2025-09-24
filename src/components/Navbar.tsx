'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCurrentUser' }),
      });
      
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My Blog</h1>
        <div className="space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          
          {loading ? (
            <span>Loading...</span>
          ) : isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="hover:underline bg-transparent border-none text-white cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="hover:underline">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}