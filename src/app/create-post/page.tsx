'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCurrentUser' }),
      });
      
      if (!res.ok) {
        router.push('/login');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
    setChecking(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title, content }),
      });
      
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      alert('Something went wrong');
    }
    
    setLoading(false);
  };

  if (checking) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-40"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}