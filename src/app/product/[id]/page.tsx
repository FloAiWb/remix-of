"use client"

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { products, fonts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Check, ShoppingCart, Download, Package, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [engravingText, setEngravingText] = useState('');
  const [selectedFont, setSelectedFont] = useState('arial');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <Button onClick={() => router.push('/catalog')}>Вернуться в каталог</Button>
      </div>
    );
  }

  // Extended images array (simulate 7 images for gallery)
  const extendedImages = [
    ...product.images,
    ...(product.images.length < 7 ? Array(7 - product.images.length).fill(product.images[0]) : [])
  ].slice(0, 7);

  const imageDescriptions = [
    'Основной вид',
    'В подарочной коробке',
    'Крупный план гравировки',
    'Вид сбоку',
    'Инфографика',
    'В интерьере',
    'Детали'
  ];

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      engraving: engravingText ? {
        text: engravingText,
        font: fonts.find(f => f.value === selectedFont)?.label || 'Arial',
      } : undefined,
    };

    addItem(cartItem);
    
    toast.success('Товар добавлен в корзину!', {
      description: engravingText ? `С гравировкой: "${engravingText}"` : undefined,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const exportPreviewAsSVG = () => {
    const selectedFontData = fonts.find(f => f.value === selectedFont);
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150">
        <rect width="400" height="150" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
        <text x="200" y="85" font-family="${selectedFontData?.fontFamily || 'Arial'}" font-size="24" text-anchor="middle" fill="#000">
          ${engravingText}
        </text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gravirovka-preview.svg';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('SVG файл загружен');
  };

  const exportPreviewAsPNG = () => {
    if (!previewRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 150;
    
    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 400, 150);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 400, 150);
    
    // Text
    const selectedFontData = fonts.find(f => f.value === selectedFont);
    ctx.font = `24px ${selectedFontData?.fontFamily || 'Arial'}`;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(engravingText, 200, 75);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gravirovka-preview.png';
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('PNG файл загружен');
    });
  };

  const selectedFontData = fonts.find(f => f.value === selectedFont);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery - 7 images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={extendedImages[selectedImage]}
              alt={`${product.name} - ${imageDescriptions[selectedImage]}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {extendedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:border-primary/50 ${
                  selectedImage === index ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
                title={imageDescriptions[index]}
              >
                <Image
                  src={image}
                  alt={imageDescriptions[index]}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {imageDescriptions[selectedImage]}
          </p>
        </div>

        {/* Product Info & Engraving Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{product.category}</Badge>
              {product.isBestseller && <Badge variant="default">Хит продаж</Badge>}
              {product.isNew && <Badge>Новинка</Badge>}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold mb-4">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            {product.material && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Материал:</span> {product.material}
              </p>
            )}
          </div>

          <Separator />

          {/* Engraving Customization - Enhanced */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <h3 className="text-lg font-semibold mb-1">Персонализация гравировкой</h3>
                <p className="text-sm text-muted-foreground">Бесплатная гравировка на все товары</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="engraving-text">Текст гравировки</Label>
                <Input
                  id="engraving-text"
                  placeholder="Введите текст..."
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.slice(0, 50))}
                  maxLength={50}
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{engravingText.length}/50 символов</span>
                  {engravingText.length > 40 && (
                    <span className="text-amber-600">Приближаетесь к лимиту</span>
                  )}
                </div>
              </div>

              {engravingText && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="font-select">Выберите шрифт</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger id="font-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.fontFamily }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preview on 15×40mm plate */}
                  <div className="space-y-3">
                    <Label>Предпросмотр на пластине 15×40 мм</Label>
                    <div 
                      ref={previewRef}
                      className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 flex items-center justify-center border-2 border-gray-300 shadow-inner"
                    >
                      <div className="bg-white rounded shadow-lg flex items-center justify-center" style={{ width: '400px', height: '150px', border: '2px solid #333' }}>
                        <p 
                          className="text-center px-4 break-words"
                          style={{ 
                            fontFamily: selectedFontData?.fontFamily || 'Arial',
                            fontSize: '24px',
                            color: '#000',
                            maxWidth: '380px'
                          }}
                        >
                          {engravingText}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportPreviewAsSVG}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Экспорт SVG
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportPreviewAsPNG}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Экспорт PNG
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center h-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  +
                </Button>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-12 text-base" 
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Добавлено!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Добавить в корзину
                </>
              )}
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => {
                handleAddToCart();
                setTimeout(() => router.push('/cart'), 600);
              }}
            >
              Купить в 1 клик
            </Button>
          </div>

          {/* Trust Badges */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Подарочная упаковка</p>
                    <p className="text-sm text-muted-foreground">Бесплатно в комплекте</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Быстрая доставка</p>
                    <p className="text-sm text-muted-foreground">2-5 дней по РФ, бесплатно от 5000₽</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Гарантия качества</p>
                    <p className="text-sm text-muted-foreground">Возврат в течение 14 дней</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}