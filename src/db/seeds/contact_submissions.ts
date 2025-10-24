import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';

async function main() {
    const sampleContactSubmissions = [
        {
            name: 'Иван Петров',
            phone: '+7 (916) 123-45-67',
            message: 'Здравствуйте! Хочу заказать браслет с индивидуальной гравировкой. Сколько это будет стоить?',
            status: 'new',
            createdAt: new Date('2024-12-15T14:30:00').toISOString(),
        },
        {
            name: 'Светлана Кузнецова',
            phone: '+7 (925) 234-56-78',
            message: 'Интересует корпоративный заказ на 30 браслетов с логотипом. Можете просчитать стоимость?',
            status: 'in_progress',
            createdAt: new Date('2024-12-14T10:15:00').toISOString(),
        },
        {
            name: 'Максим Орлов',
            phone: '+7 (903) 345-67-89',
            message: 'Добрый день! Можно ли заказать жетон с нестандартными размерами?',
            status: 'resolved',
            createdAt: new Date('2024-12-13T16:45:00').toISOString(),
        },
        {
            name: 'Наталья Виноградова',
            phone: '+7 (499) 456-78-90',
            message: 'Здравствуйте! Хочу сделать подарок, подскажите что лучше выбрать для мужчины?',
            status: 'new',
            createdAt: new Date('2024-12-12T11:20:00').toISOString(),
        },
        {
            name: 'Павел Григорьев',
            phone: '+7 (926) 567-89-01',
            message: 'Добрый день! Интересуют сроки изготовления индивидуального заказа на 10 браслетов.',
            status: 'in_progress',
            createdAt: new Date('2024-12-11T09:00:00').toISOString(),
        },
        {
            name: 'Елена Романова',
            phone: '+7 (495) 678-90-12',
            message: 'Здравствуйте! Можно ли забрать заказ самовывозом из Москвы?',
            status: 'resolved',
            createdAt: new Date('2024-12-10T13:30:00').toISOString(),
        },
    ];

    await db.insert(contactSubmissions).values(sampleContactSubmissions);
    
    console.log('✅ Contact submissions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});