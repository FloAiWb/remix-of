import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';

async function main() {
    const sampleSubscribers = [
        {
            email: 'ivan.petrov@mail.ru',
            isActive: true,
            subscribedAt: new Date('2024-10-15T10:30:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'maria.sokolova@yandex.ru',
            isActive: true,
            subscribedAt: new Date('2024-11-02T14:20:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'sergey.ivanov@gmail.com',
            isActive: true,
            subscribedAt: new Date('2024-10-28T09:15:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'anna.kuznetsova@mail.ru',
            isActive: false,
            subscribedAt: new Date('2024-10-05T16:45:00').toISOString(),
            unsubscribedAt: new Date('2024-12-18T11:30:00').toISOString(),
        },
        {
            email: 'dmitry.volkov@yandex.ru',
            isActive: true,
            subscribedAt: new Date('2024-11-12T08:00:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'olga.novikova@gmail.com',
            isActive: true,
            subscribedAt: new Date('2024-10-20T13:25:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'alexey.morozov@mail.ru',
            isActive: true,
            subscribedAt: new Date('2024-11-08T17:40:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'ekaterina.popova@yandex.ru',
            isActive: true,
            subscribedAt: new Date('2024-10-25T12:10:00').toISOString(),
            unsubscribedAt: null,
        },
        {
            email: 'andrey.fedorov@gmail.com',
            isActive: false,
            subscribedAt: new Date('2024-10-10T15:55:00').toISOString(),
            unsubscribedAt: new Date('2024-12-22T09:20:00').toISOString(),
        },
        {
            email: 'tatyana.lebedeva@mail.ru',
            isActive: true,
            subscribedAt: new Date('2024-11-18T11:05:00').toISOString(),
            unsubscribedAt: null,
        },
    ];

    await db.insert(newsletterSubscribers).values(sampleSubscribers);
    
    console.log('✅ Newsletter subscribers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});