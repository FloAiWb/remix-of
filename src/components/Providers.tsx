"use client"

import type { ReactNode } from 'react';

import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}
