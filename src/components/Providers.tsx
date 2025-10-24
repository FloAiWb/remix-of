"use client"

import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}
