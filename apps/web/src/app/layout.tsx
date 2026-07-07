import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import './global.css';

export const metadata = {
  title: 'product-listing',
  description: 'Product catalog app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
