"use client"

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface GalleryWork {
  id: number;
  image: string;
  title: string;
  orderIndex: number;
}

export function WorkGallery() {
  const [works, setWorks] = useState<GalleryWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/gallery-works');
        if (!response.ok) throw new Error('Failed to fetch gallery works');
        const data: GalleryWork[] = await response.json();
        setWorks(data);
      } catch (error) {
        console.error('Error fetching gallery works:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Наши работы</h2>
            <p className="text-muted-foreground">
              Примеры готовых изделий с гравировкой
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (works.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Наши работы</h2>
          <p className="text-muted-foreground">
            Примеры готовых изделий с гравировкой
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {works.map((work) => (
            <Card key={work.id} className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium">{work.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}