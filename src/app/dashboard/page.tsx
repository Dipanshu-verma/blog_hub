'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
     
      const userRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getCurrentUser' }),
      });
      
      if (!userRes.ok) {
       
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      setCurrentUser(userData.user);

 
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.log('Error:', error);
      router.push('/login');
    }
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      
      checkAuthAndFetchData(); 
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link 
          href="/create-post"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet. Create your first post!</p>
        ) : (
          posts.map((post: any) => (
            <div key={post._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-2">{post.content.substring(0, 150)}...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  By {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  {currentUser && currentUser.userId === post.authorId && (
                    <>
                      <Link
                        href={`/edit-post/${post._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}