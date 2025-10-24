"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Введите email адрес');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Введите корректный email адрес');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ALREADY_SUBSCRIBED') {
          toast.info('Вы уже подписаны на нашу рассылку');
        } else {
          throw new Error(data.error || 'Ошибка подписки');
        }
        return;
      }

      toast.success('Спасибо за подписку! Скоро вы получите первое письмо.');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка при подписке');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-foreground/10 mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Получайте спецпредложения</h2>
          <p className="text-lg opacity-90 mb-8">
            Подпишитесь на рассылку и получите скидку 10% на первый заказ
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              variant="secondary" 
              size="lg"
              className="h-12 px-8 whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Подписаться'}
            </Button>
          </form>
          
          <p className="text-sm opacity-75 mt-4">
            Отписаться можно в любой момент. Мы не передаем данные третьим лицам.
          </p>
        </div>
      </div>
    </section>
  );
}