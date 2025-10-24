"use client"

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl">GravMix</h3>
            <p className="text-sm text-muted-foreground">
              Подарки с гравировкой премиум качества. Браслеты, жетоны, брелоки, коробочки и многое другое.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="tel:+79996930620"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Позвонить"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=79996930620"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/gravmixTT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://vk.com/gravmix?from=groups"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="ВКонтакте"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.75h-1.41c-.54 0-.71-.43-1.68-1.42-0.85-.82-1.22-.93-1.43-.93-0.29 0-.38.09-.38.52v1.3c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.46-2.66C6.31 11.69 5.81 9.73 5.81 9.32c0-.21.09-.41.52-.41h1.41c.39 0 .53.18.68.59.77 2.13 2.06 4 2.59 4 0.2 0 .29-.09.29-.59V11.7c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.37-.34h2.21c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.2 0 .37-.11.74-.48 1.13-1.28 1.94-3.25 1.94-3.25.11-.23.28-.41.67-.41h1.41c.42 0 .51.22.42.52-.15.7-1.54 2.94-1.54 2.94-.17.28-.23.4 0 .72.17.23.73.71 1.1 1.14.68.77 1.2 1.41 1.34 1.86.14.44-.08.67-.51.67z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-muted-foreground hover:text-foreground transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+79996930620" className="text-muted-foreground hover:text-foreground transition-colors">
                  +7 999 693-06-20
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:mixmarketplace161@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors break-all">
                  mixmarketplace161@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Россия, Краснодарский край, станица Староминская, ул. Набережная, 133А
                </span>
              </li>
            </ul>
          </div>

          {/* Marketplaces */}
          <div className="space-y-4">
            <h4 className="font-semibold">Где купить</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.wildberries.ru/seller/1318937"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              >
                Wildberries
              </a>
              <a
                href="https://www.ozon.ru/product/2716653488"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              >
                Ozon
              </a>
              <a
                href="https://vk.com/gravmix?from=groups"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              >
                VK Группа
              </a>
              <a
                href="https://t.me/gravmixTT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GravMix. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="https://yandex.ru/profile/163484252340?lang=ru"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Яндекс Карты
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}