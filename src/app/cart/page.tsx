"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const deliveryFee = totalPrice >= 5000 ? 0 : 500;
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Корзина пуста</h2>
            <p className="text-muted-foreground">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Link href="/catalog">
              <Button className="w-full">Перейти в каталог</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Продолжить покупки
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Корзина ({totalItems})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.engraving && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>Гравировка: "{item.engraving.text}"</p>
                            <p>Шрифт: {item.engraving.font}</p>
                          </div>
                        )}
                      </div>
                      <p className="font-bold">{item.price.toLocaleString('ru-RU')} ₽</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Итого</h3>
              
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары ({totalItems})</span>
                  <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Бесплатно</span>
                    ) : (
                      `${deliveryFee.toLocaleString('ru-RU')} ₽`
                    )}
                  </span>
                </div>
              </div>

              {totalPrice < 5000 && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    Добавьте товаров на {(5000 - totalPrice).toLocaleString('ru-RU')} ₽ 
                    для бесплатной доставки
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>К оплате</span>
                <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
              </div>

              <Button size="lg" className="w-full">
                Оформить заказ
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                При оформлении заказа вы соглашаетесь с условиями использования
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
