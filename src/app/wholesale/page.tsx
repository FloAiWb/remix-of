"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Percent, Zap, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WholesalePage() {
  const benefits = [
    {
      icon: Percent,
      title: "Скидки до 30%",
      description: "Гибкая система скидок в зависимости от объема заказа"
    },
    {
      icon: Package,
      title: "Большой ассортимент",
      description: "Браслеты, жетоны, брелоки, зажигалки, кулоны, ручки, бокалы"
    },
    {
      icon: Zap,
      title: "Быстрая гравировка",
      description: "Массовая персонализация изделий от 1000 штук"
    },
    {
      icon: TrendingUp,
      title: "Партнерская программа",
      description: "Дополнительные бонусы для постоянных партнеров"
    }
  ];

  const priceTable = [
    { volume: "100-500 шт", discount: "10%", description: "Минимальный опт" },
    { volume: "500-1000 шт", discount: "15%", description: "Средний опт" },
    { volume: "1000-5000 шт", discount: "20%", description: "Крупный опт" },
    { volume: "5000+ шт", discount: "до 30%", description: "VIP условия" }
  ];

  const services = [
    "Индивидуальная гравировка на каждом изделии",
    "Персонализация по вашим макетам",
    "Упаковка с вашим брендингом",
    "Дропшиппинг и работа с маркетплейсами",
    "Гибкие сроки производства",
    "Менеджер для крупных заказов"
  ];

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
              <Package className="h-3 w-3 mr-1" />
              Для бизнеса
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Оптовое сотрудничество
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Выгодные условия для магазинов, маркетплейсов и корпоративных клиентов. 
              Персонализированные подарки оптом с индивидуальной гравировкой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+79996930620">
                <Button size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Обсудить условия
                </Button>
              </a>
              <a href="https://api.whatsapp.com/send?phone=79996930620&text=Здравствуйте! Интересует оптовое сотрудничество">
                <Button size="lg" variant="outline">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Преимущества работы с нами
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Table */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Оптовые скидки
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Чем больше заказ — тем выгоднее цена. Индивидуальные условия для постоянных партнеров.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {priceTable.map((tier, index) => (
              <motion.div
                key={tier.volume}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`h-full ${index === 3 ? 'border-primary border-2' : ''}`}>
                  <CardHeader>
                    {index === 3 && (
                      <Badge className="w-fit mb-2">Лучшее предложение</Badge>
                    )}
                    <CardTitle className="text-xl">{tier.volume}</CardTitle>
                    <p className="text-3xl font-bold text-primary">{tier.discount}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Услуги для оптовых клиентов
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Полный спектр услуг для вашего бизнеса
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Engraving Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Оптовая гравировка персонализированных изделий
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Массовая персонализация подарков с индивидуальной гравировкой на каждом изделии. 
              Идеально для корпоративных подарков, свадеб, мероприятий и сувенирной продукции.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                  <p className="text-sm text-muted-foreground">Изделий в день</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">24 часа</p>
                  <p className="text-sm text-muted-foreground">Работа оборудования</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">100%</p>
                  <p className="text-sm text-muted-foreground">Контроль качества</p>
                </CardContent>
              </Card>
            </div>
            <Link href="/equipment">
              <Button size="lg" variant="outline">
                Посмотреть наше оборудование
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Готовы начать сотрудничество?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Свяжитесь с нами для обсуждения условий и расчета стоимости вашего заказа
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+79996930620">
                <Button size="lg" variant="secondary">
                  <Phone className="h-5 w-5 mr-2" />
                  +7 999 693-06-20
                </Button>
              </a>
              <a href="https://t.me/gravmixTT">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Telegram
                </Button>
              </a>
              <Link href="/contacts">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Написать нам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}