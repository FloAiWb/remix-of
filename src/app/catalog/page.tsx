"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { products, categories, materials } from '@/data/products';
import { SlidersHorizontal } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedMaterial, setSelectedMaterial] = useState('Все материалы');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [filterType, setFilterType] = useState<'all' | 'bestsellers' | 'new'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    
    if (category) {
      setSelectedCategory(decodeURIComponent(category));
    }
    if (filter === 'bestsellers') {
      setFilterType('bestsellers');
    } else if (filter === 'new') {
      setFilterType('new');
    }
  }, [searchParams]);

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'Все' && product.category !== selectedCategory) {
      return false;
    }
    
    // Material filter
    if (selectedMaterial !== 'Все материалы' && product.material && !product.material.includes(selectedMaterial)) {
      return false;
    }
    
    // Price range filter
    if (priceRange === 'low' && product.price > 800) return false;
    if (priceRange === 'mid' && (product.price <= 800 || product.price > 2000)) return false;
    if (priceRange === 'high' && product.price <= 2000) return false;
    
    // Type filter
    if (filterType === 'bestsellers' && !product.isBestseller) return false;
    if (filterType === 'new' && !product.isNew) return false;
    
    return true;
  });

  const resetFilters = () => {
    setSelectedCategory('Все');
    setSelectedMaterial('Все материалы');
    setPriceRange('all');
    setFilterType('all');
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Каталог товаров</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-20 space-y-6">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="w-full lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Фильтры
            </Button>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-3">Категория</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <h3 className="font-semibold mb-3">Материал</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedMaterial === material
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold mb-3">Цена</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPriceRange('all')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      priceRange === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    Любая цена
                  </button>
                  <button
                    onClick={() => setPriceRange('low')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      priceRange === 'low'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    До 800 ₽
                  </button>
                  <button
                    onClick={() => setPriceRange('mid')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      priceRange === 'mid'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    800 - 2000 ₽
                  </button>
                  <button
                    onClick={() => setPriceRange('high')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      priceRange === 'high'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    От 2000 ₽
                  </button>
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <h3 className="font-semibold mb-3">Особые</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filterType === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    Все товары
                  </button>
                  <button
                    onClick={() => setFilterType('bestsellers')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filterType === 'bestsellers'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    Хиты продаж
                  </button>
                  <button
                    onClick={() => setFilterType('new')}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filterType === 'new'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    Новинки
                  </button>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                          Новинка
                        </div>
                      )}
                      {product.isBestseller && (
                        <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
                          Хит
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Товары не найдены
              </p>
              <Button onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </div>
  );
}