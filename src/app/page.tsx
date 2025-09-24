import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
      <p className="text-gray-600 mb-8">A simple blog application</p>
      <div className="space-x-4">
        <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 text-white px-6 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
}