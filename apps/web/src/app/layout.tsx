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
      <body>{children}</body>
    </html>
  );
}
