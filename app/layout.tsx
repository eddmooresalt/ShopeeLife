// app/layout.tsx
import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShopeeLife App',
  description: 'ShopeeLife app deployed via Vercel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
