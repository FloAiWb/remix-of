"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="lg"
      className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform p-0"
      aria-label="Вернуться наверх"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
