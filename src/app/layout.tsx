import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}