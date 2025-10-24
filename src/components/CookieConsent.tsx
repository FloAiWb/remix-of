"use client"

import { useState, useEffect, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Accept cookies clicked');
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Decline cookies clicked');
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl pointer-events-auto">
      <Card className="shadow-2xl border-2">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">Мы используем cookie</h3>
              <p className="text-sm text-muted-foreground">
                Мы используем файлы cookie для улучшения работы сайта и персонализации вашего опыта. 
                Продолжая использовать сайт, вы соглашаетесь с нашей политикой конфиденциальности.
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
              <Button 
                onClick={acceptCookies}
                type="button"
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Принять
              </Button>
              <Button 
                onClick={declineCookies}
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Отклонить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}