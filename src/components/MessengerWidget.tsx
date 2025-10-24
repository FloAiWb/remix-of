"use client"

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function MessengerWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const messengers = [
    {
      name: 'Telegram',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      link: 'https://t.me/gravmixTT',
      color: 'text-[#0088cc]'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      link: 'https://wa.me/79999999999',
      color: 'text-[#25D366]'
    },
    {
      name: 'ВКонтакте',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.13 14.75h-1.41c-.54 0-.71-.43-1.68-1.42-0.85-.82-1.22-.93-1.43-.93-0.29 0-.38.09-.38.52v1.3c0 .35-.11.56-1.04.56-1.54 0-3.25-.93-4.46-2.66C6.31 11.69 5.81 9.73 5.81 9.32c0-.21.09-.41.52-.41h1.41c.39 0 .53.18.68.59.77 2.13 2.06 4 2.59 4 0.2 0 .29-.09.29-.59V11.7c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.37-.34h2.21c.31 0 .42.16.42.52v2.8c0 .31.14.42.23.42.2 0 .37-.11.74-.48 1.13-1.28 1.94-3.25 1.94-3.25.11-.23.28-.41.67-.41h1.41c.42 0 .51.22.42.52-.15.7-1.54 2.94-1.54 2.94-.17.28-.23.4 0 .72.17.23.73.71 1.10 1.14.68.77 1.2 1.41 1.34 1.86.14.44-.08.67-.51.67z"/>
        </svg>
      ),
      link: 'https://vk.com/gravmix?from=groups',
      color: 'text-[#0077FF]'
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        ) : (
          <Card className="w-72 shadow-xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Напишите нам</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Выберите удобный мессенджер для связи
              </p>
              
              <div className="space-y-2">
                {messengers.map((messenger) => (
                  <a
                    key={messenger.name}
                    href={messenger.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className={messenger.color}>
                      {messenger.icon}
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {messenger.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
