"use client"

import Link from 'next/link';
import { ShoppingCart, Menu, Phone, MessageCircle, Send, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { totalItems } = useCart();
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Оборудование', href: '/equipment' },
    { name: 'Оптовое сотрудничество', href: '/wholesale' },
    { name: 'Контакты', href: '/contacts' },
  ];

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Ошибка выхода");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Вы вышли из аккаунта");
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl tracking-tight">GravMix</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Contact Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a
                  href="tel:+79996930620"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Позвонить"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a
                  href="https://api.whatsapp.com/send?phone=79996930620"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a
                  href="https://t.me/gravmixTT"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a
                  href="https://vk.com/gravmix?from=groups"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ВКонтакте"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.75h-1.41c-.54 0-.71-.43-1.68-1.42-0.85-.82-1.22-.93-1.43-.93-0.29 0-.38.09-.38.52v1.3c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.46-2.66C6.31 11.69 5.81 9.73 5.81 9.32c0-.21.09-.41.52-.41h1.41c.39 0 .53.18.68.59.77 2.13 2.06 4 2.59 4 0.2 0 .29-.09.29-.59V11.7c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.37-.34h2.21c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.2 0 .37-.11.74-.48 1.13-1.28 1.94-3.25 1.94-3.25.11-.23.28-.41.67-.41h1.41c.42 0 .51.22.42.52-.15.7-1.54 2.94-1.54 2.94-.17.28-.23.4 0 .72.17.23.73.71 1.10 1.14.68.77 1.2 1.41 1.34 1.86.14.44-.08.67-.51.67z"/>
                  </svg>
                </a>
              </Button>
            </div>

            {/* Auth Buttons - Desktop */}
            {!isPending && (
              <div className="hidden md:flex items-center gap-2">
                {session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/admin/products')}>
                        Админка
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="h-9">
                        <LogIn className="mr-2 h-4 w-4" />
                        Вход
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="h-9">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Регистрация
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Auth Section - Mobile */}
                  {!isPending && (
                    <div className="border-t pt-4">
                      {session?.user ? (
                        <div className="space-y-3">
                          <div className="px-2">
                            <p className="text-sm font-medium">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                          </div>
                          <Link href="/admin/products" className="block">
                            <Button variant="secondary" className="w-full justify-start">
                              Админка
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleSignOut}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Выйти
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link href="/login" className="block">
                            <Button variant="outline" className="w-full justify-start">
                              <LogIn className="mr-2 h-4 w-4" />
                              Вход
                            </Button>
                          </Link>
                          <Link href="/register" className="block">
                            <Button className="w-full justify-start">
                              <UserPlus className="mr-2 h-4 w-4" />
                              Регистрация
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-3">Связаться с нами:</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="tel:+79996930620"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        📞 +7 999 693-06-20
                      </a>
                      <a
                        href="https://api.whatsapp.com/send?phone=79996930620"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href="https://t.me/gravmixTT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        ✈️ Telegram
                      </a>
                      <a
                        href="https://vk.com/gravmix?from=groups"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        🔵 ВКонтакте
                      </a>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Где купить:</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://www.wildberries.ru/seller/1318937"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        Wildberries
                      </a>
                      <a
                        href="https://www.ozon.ru/product/2716653488"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors"
                      >
                        Ozon
                      </a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}