'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPost({ params }: PageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
      fetchPost(resolvedParams.id);
    }
    getParams();
  }, [params]);

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getOne', id }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
      }
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: postId, title, content }),
      });
      
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
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
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}