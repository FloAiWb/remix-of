"use client"

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
  date: string;
  isFeatured: boolean;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?featured=true');
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data: Testimonial[] = await response.json();
        setTestimonials(data.slice(0, 4)); // Show only 4 featured testimonials
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Отзывы клиентов</h2>
            <p className="text-muted-foreground">
              Что говорят наши покупатели о работе с нами
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                  <div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-1" />
                    <div className="h-2 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Отзывы клиентов</h2>
          <p className="text-muted-foreground">
            Что говорят наши покупатели о работе с нами
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={testimonial.image}
                  alt={`Отзыв от ${testimonial.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {testimonial.text}
                </p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}