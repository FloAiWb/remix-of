"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, Shield, Star, TrendingUp, ExternalLink, Sparkles, Type, Eye } from 'lucide-react';
import { WorkGallery } from '@/components/WorkGallery';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { QuickContactForm } from '@/components/QuickContactForm';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ScrollProgress } from '@/components/ScrollProgress';
import { CustomCursor } from '@/components/CustomCursor';
import { TextReveal } from '@/components/TextReveal';
import { TiltCard } from '@/components/TiltCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useMagneticHover } from '@/hooks/useMagneticHover';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  material?: string;
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enable smooth scrolling
  useSmoothScroll();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all products
        const response = await fetch('/api/products?limit=100');
        if (!response.ok) throw new Error('Failed to fetch products');
        const allProducts: Product[] = await response.json();
        
        setProducts(allProducts);
        
        // Filter bestsellers and new products
        setBestsellers(allProducts.filter(p => p.isBestseller).slice(0, 4));
        setNewProducts(allProducts.filter(p => p.isNew).slice(0, 4));
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Magnetic button ref
  const magneticRef = useMagneticHover(0.3);

  return (
    <div className="flex flex-col">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Hero Section - Parallax */}
      <section ref={heroRef} className="relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ opacity: heroOpacity }}
            >
              <TextReveal className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Подарки с гравировкой
              </TextReveal>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Браслеты, жетоны, брелоки, зажигалки, кулоны, ручки и бокалы с персональной гравировкой. 
                Создайте уникальный подарок для близких.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div ref={magneticRef} style={{ transition: 'transform 0.3s ease' }}>
                  <Link href="/catalog">
                    <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 group relative overflow-hidden">
                      <span className="relative z-10">Смотреть каталог</span>
                      <motion.span
                        className="ml-2 inline-block relative z-10"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Trust badges */}
              <motion.div 
                className="flex items-center gap-6 pt-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-medium">4.9/5</span>
                </motion.div>
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">500+</span> довольных клиентов
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative aspect-[4/3] lg:aspect-square"
              style={{ y: heroY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/hero-banner-image-leather-bracelet-with--8d8f94e5-20251021101613.jpg"
                  alt="Браслет с гравировкой GravMix"
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Where to Buy Section - Animated Cards */}
      <section className="py-12 bg-background border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TextReveal className="text-2xl font-bold mb-2">
              Где купить наши товары
            </TextReveal>
            <p className="text-muted-foreground">Выберите удобную площадку для покупки</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { href: "https://www.wildberries.ru/seller/1318937", name: "Wildberries", short: "WB", desc: "Большой выбор товаров" },
              { href: "https://www.ozon.ru/product/2716653488", name: "Ozon", short: "OZON", desc: "Быстрая доставка" },
              { href: "https://vk.com/gravmix?from=groups", name: "ВКонтакте", short: "vk", desc: "Наша группа" },
              { href: "https://t.me/gravmixTT", name: "Telegram", short: "tg", desc: "Прямая связь" }
            ].map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <TiltCard>
                  <Card className="h-full hover:shadow-2xl transition-all hover:border-primary/50 hover:bg-accent/5">
                    <CardContent className="p-6 text-center space-y-3">
                      <motion.div 
                        className="h-12 flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {platform.short === "WB" && <span className="text-2xl font-bold text-primary">WB</span>}
                        {platform.short === "OZON" && <span className="text-2xl font-bold text-primary">OZON</span>}
                        {platform.short === "vk" && (
                          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.75h-1.41c-.54 0-.71-.43-1.68-1.42-0.85-.82-1.22-.93-1.43-.93-0.29 0-.38.09-.38.52v1.3c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.46-2.66C6.31 11.69 5.81 9.73 5.81 9.32c0-.21.09-.41.52-.41h1.41c.39 0 .53.18.68.59.77 2.13 2.06 4 2.59 4 0.2 0 .29-.09.29-.59V11.7c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.37-.34h2.21c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.2 0 .37-.11.74-.48 1.13-1.28 1.94-3.25 1.94-3.25.11-.23.28-.41.67-.41h1.41c.42 0 .51.22.42.52-.15.7-1.54 2.94-1.54 2.94-.17.28-.23.4 0 .72.17.23.73.71 1.10 1.14.68.77 1.2 1.41 1.34 1.86.14.44-.08.67-.51.67z"/>
                          </svg>
                        )}
                        {platform.short === "tg" && (
                          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                          </svg>
                        )}
                      </motion.div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.desc}</p>
                      <ExternalLink className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Engraving Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-background relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Персонализация</span>
                </motion.div>
              </motion.div>
              
              <TextReveal className="text-4xl lg:text-5xl font-bold leading-tight">
                Индивидуальная гравировка
              </TextReveal>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Сделайте ваш подарок по-настоящему уникальным. Добавьте имя, дату, координаты или специальное послание. 
                Мы гравируем с помощью современного лазерного оборудования — результат будет четким и долговечным.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { icon: Type, title: "Любой текст", desc: "Имена, даты, координаты, цитаты — напишите то, что имеет значение" },
                  { icon: Eye, title: "Предпросмотр перед заказом", desc: "Увидите, как будет выглядеть гравировка на вашем изделии" },
                  { icon: Sparkles, title: "Быстрое изготовление", desc: "Гравировка выполняется за 1-2 рабочих дня" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link href="/catalog">
                  <Button size="lg" className="mt-4 h-12 px-8 group">
                    Выбрать товар для гравировки
                    <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <TiltCard className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/hero-banner-image-leather-bracelet-with--8d8f94e5-20251021101613.jpg"
                  alt="Пример индивидуальной гравировки"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-medium mb-1">Пример гравировки</p>
                  <p className="text-2xl font-bold">"Всегда с тобой"</p>
                </div>
              </TiltCard>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* USPs - Animated Icons */}
      <section className="py-16 border-y bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Быстрая доставка", desc: "По всей России за 2-5 дней" },
              { icon: Package, title: "Подарочная упаковка", desc: "Красивая упаковка в комплекте" },
              { icon: Shield, title: "Гарантия качества", desc: "Возврат в течение 14 дней" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Staggered Animation */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TextReveal className="text-3xl font-bold mb-8">
            Категории
          </TextReveal>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link href={`/catalog?category=${encodeURIComponent(category)}`}>
                    <Card className="group cursor-pointer hover:shadow-xl transition-all hover:border-primary/50 overflow-hidden relative">
                      <motion.div
                        className="absolute inset-0 bg-primary/5"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <CardContent className="p-6 text-center relative z-10">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {category}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers - Scale on Hover */}
      {!isLoading && bestsellers.length > 0 && (
        <section className="py-16 lg:py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex justify-between items-end mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <TextReveal className="text-3xl font-bold mb-2">
                  Хиты продаж
                </TextReveal>
                <p className="text-muted-foreground">Самые популярные товары</p>
              </div>
              <Link href="/catalog?filter=bestsellers">
                <Button variant="ghost" className="hidden sm:flex">
                  Все хиты
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <TiltCard>
                      <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {!isLoading && newProducts.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex justify-between items-end mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <TextReveal className="text-3xl font-bold mb-2">
                  Новинки
                </TextReveal>
                <p className="text-muted-foreground">Последние поступления</p>
              </div>
              <Link href="/catalog?filter=new">
                <Button variant="ghost" className="hidden sm:flex">
                  Все новинки
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <TiltCard>
                      <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-shadow">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <motion.div 
                            className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                          >
                            Новинка
                          </motion.div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Gallery */}
      <WorkGallery />

      {/* Testimonials */}
      <Testimonials />

      {/* Trust / Guarantee Section - Animated Stats */}
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <TextReveal className="text-3xl font-bold">
              Работаем честно
            </TextReveal>
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Мы гарантируем качество каждого изделия и гравировки. Если товар не подошёл — 
              вернём деньги в течение 14 дней без лишних вопросов.
            </motion.p>
            <div className="grid sm:grid-cols-3 gap-6 pt-6">
              {[
                { value: "500+", label: "Довольных клиентов" },
                { value: "4.9/5", label: "Средняя оценка" },
                { value: "2-3 дня", label: "Изготовление" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="space-y-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.div 
                    className="text-3xl font-bold"
                    whileHover={{ scale: 1.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Quick Contact Form */}
      <QuickContactForm />

      {/* Newsletter Form */}
      <NewsletterForm />

      {/* CTA Section - Gradient Animation */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 30%, currentColor 50%, transparent 70%)',
            backgroundSize: '200% 100%'
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <TextReveal className="text-3xl lg:text-4xl font-bold mb-4 text-primary-foreground">
            Создайте уникальный подарок
          </TextReveal>
          <motion.p 
            className="text-lg mb-8 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Выберите товар и добавьте персональную гравировку. Это просто, быстро и доступно!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/catalog">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base group">
                  Перейти в каталог
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}