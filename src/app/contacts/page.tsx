import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Контакты - GravMix',
  description: 'Свяжитесь с нами любым удобным способом. Телефон, WhatsApp, Telegram, email.',
};

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Контакты</h1>
        <p className="text-muted-foreground mb-8">
          Свяжитесь с нами любым удобным способом
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Телефон</p>
                      <a 
                        href="tel:+79996930620"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +7 999 693-06-20
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a 
                        href="mailto:mixmarketplace161@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        mixmarketplace161@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Адрес</p>
                      <p className="text-muted-foreground">
                        Россия, Краснодарский край,<br />
                        станица Староминская,<br />
                        ул. Набережная, 133А
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Мессенджеры</h2>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://api.whatsapp.com/send?phone=79996930620"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://t.me/gravmixTT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-5 w-5 mr-3" />
                      Telegram
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://vk.com/gravmix?from=groups"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.75h-1.41c-.54 0-.71-.43-1.68-1.42-0.85-.82-1.22-.93-1.43-.93-0.29 0-.38.09-.38.52v1.3c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.46-2.66C6.31 11.69 5.81 9.73 5.81 9.32c0-.21.09-.41.52-.41h1.41c.39 0 .53.18.68.59.77 2.13 2.06 4 2.59 4 0.2 0 .29-.09.29-.59V11.7c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.37-.34h2.21c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.2 0 .37-.11.74-.48 1.13-1.28 1.94-3.25 1.94-3.25.11-.23.28-.41.67-.41h1.41c.42 0 .51.22.42.52-.15.7-1.54 2.94-1.54 2.94-.17.28-.23.4 0 .72.17.23.73.71 1.10 1.14.68.77 1.2 1.41 1.34 1.86.14.44-.08.67-.51.67z"/>
                      </svg>
                      ВКонтакте
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Маркетплейсы</h2>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://www.wildberries.ru/seller/1318937"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Wildberries
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://www.ozon.ru/product/2716653488"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ozon - Товар 1
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://www.ozon.ru/product/2716653821"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ozon - Товар 2
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-12"
                    asChild
                  >
                    <a
                      href="https://t.me/gravmixTT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Telegram-магазин
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card className="h-full">
              <CardContent className="pt-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Мы на карте</h2>
                <div className="relative w-full h-[500px] lg:h-[calc(100%-3rem)] rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=39.009614%2C46.540619&mode=search&oid=163484252340&ol=biz&z=17"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{ position: 'relative' }}
                    title="Карта GravMix"
                  />
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a
                      href="https://yandex.ru/profile/163484252340?lang=ru"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть в Яндекс.Картах
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Working Hours / Additional Info */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Дополнительная информация</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Гравировка</h3>
                <p className="text-sm text-muted-foreground">
                  Бесплатная гравировка на все товары. Выберите шрифт и добавьте персональный текст.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Доставка</h3>
                <p className="text-sm text-muted-foreground">
                  Быстрая доставка по РФ. Бесплатная доставка при заказе от 5000₽.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Гарантия</h3>
                <p className="text-sm text-muted-foreground">
                  Гарантия качества на все изделия. Возврат в течение 14 дней.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}