"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    delivery: 'russian-post',
    payment: 'card-online',
  });

  const deliveryOptions = [
    { value: 'russian-post', label: 'Почта России', price: 0, days: '5-7 дней' },
    { value: 'cdek', label: 'СДЭК', price: 350, days: '2-4 дня' },
    { value: 'express', label: 'Экспресс-доставка', price: 800, days: '1-2 дня' },
  ];

  const paymentOptions = [
    { value: 'card-online', label: 'Банковская карта онлайн' },
    { value: 'cash', label: 'Наличными при получении' },
    { value: 'transfer', label: 'Банковский перевод' },
  ];

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-muted-foreground mb-6">Добавьте товары в корзину, чтобы оформить заказ</p>
        <Button onClick={() => router.push('/catalog')}>Перейти в каталог</Button>
      </div>
    );
  }

  const selectedDelivery = deliveryOptions.find(d => d.value === formData.delivery);
  const deliveryPrice = totalAmount >= 5000 ? 0 : (selectedDelivery?.price || 0);
  const finalTotal = totalAmount + deliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSuccess(true);
    clearCart();
    setIsSubmitting(false);
    
    toast.success('Заказ успешно оформлен!', {
      description: 'Мы свяжемся с вами в ближайшее время',
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <div className="mb-6 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Заказ оформлен!</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Спасибо за покупку в GravMix
            </p>
            <p className="text-muted-foreground mb-8">
              Мы отправили подтверждение на вашу почту {formData.email || 'и свяжемся с вами в ближайшее время'}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/')}>
                На главную
              </Button>
              <Button variant="outline" onClick={() => router.push('/catalog')}>
                Продолжить покупки
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад
      </Button>

      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Контактные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя и фамилия *</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 999 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (необязательно)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Адрес доставки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Город *</Label>
                  <Input
                    id="city"
                    placeholder="Москва"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    placeholder="ул. Примерная, д. 1, кв. 1"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Способ доставки</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.delivery}
                  onValueChange={(value) => setFormData({ ...formData, delivery: value })}
                >
                  <div className="space-y-3">
                    {deliveryOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-sm text-muted-foreground">{option.days}</p>
                            </div>
                            <p className="font-semibold">
                              {totalAmount >= 5000 ? (
                                <span className="text-green-600">Бесплатно</span>
                              ) : option.price === 0 ? (
                                'Бесплатно'
                              ) : (
                                `${option.price} ₽`
                              )}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {totalAmount < 5000 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    * Бесплатная доставка при заказе от 5000₽
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.payment}
                  onValueChange={(value) => setFormData({ ...formData, payment: value })}
                >
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        {item.engraving && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            Гравировка: {item.engraving.text}
                          </p>
                        )}
                        <p className="text-sm">
                          {item.quantity} × {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товары ({items.length})</span>
                    <span className="font-medium">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className="font-medium">
                      {deliveryPrice === 0 ? (
                        <span className="text-green-600">Бесплатно</span>
                      ) : (
                        `${deliveryPrice.toLocaleString('ru-RU')} ₽`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого</span>
                    <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
