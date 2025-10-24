"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface Equipment {
  id: number;
  name: string;
  power: string;
  type: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  price: number;
  imageUrl: string;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/equipment');
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              Выставочный зал оборудования
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Наше оборудование
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Мы работаем на современных лазерных станках для профессиональной гравировки и маркировки. Это оборудование, которым мы создаем ваши изделия с гравировкой.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipment.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary">
                        {item.power}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{item.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Технические возможности:</h4>
                        <ul className="space-y-1">
                          {item.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Хотите увидеть наше оборудование в работе?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Приглашаем посетить наш выставочный зал и посмотреть, как мы создаем изделия с гравировкой на профессиональном оборудовании
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+79996930620">
                <Button size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Позвонить нам
                </Button>
              </a>
              <Link href="/contacts">
                <Button size="lg" variant="outline">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}