import { db } from '@/db';
import { testimonials } from '@/db/schema';

async function main() {
    const sampleTestimonials = [
        {
            name: 'Алексей Иванов',
            rating: 5,
            text: 'Отличный браслет! Качество на высоте, паракорд прочный. Доставка быстрая, упаковка аккуратная.',
            image: '/images/testimonials/avatar1.jpg',
            date: '15 марта 2024',
            isFeatured: true,
            createdAt: new Date('2024-03-15').toISOString(),
        },
        {
            name: 'Мария Петрова',
            rating: 5,
            text: 'Купила в подарок мужу браслет и брелок. Очень понравилось качество и внимание к деталям. Муж носит каждый день!',
            image: '/images/testimonials/avatar2.jpg',
            date: '22 апреля 2024',
            isFeatured: true,
            createdAt: new Date('2024-04-22').toISOString(),
        },
        {
            name: 'Сергей Козлов',
            rating: 5,
            text: 'Заказывал жетоны для своего подразделения. Все пришло вовремя, гравировка четкая. Ребята довольны!',
            image: '/images/testimonials/avatar3.jpg',
            date: '8 мая 2024',
            isFeatured: true,
            createdAt: new Date('2024-05-08').toISOString(),
        },
        {
            name: 'Анна Смирнова',
            rating: 4,
            text: 'Красивый браслет, хорошо сплетен. Носю уже 3 месяца - как новый. Единственное - доставка заняла чуть больше времени.',
            image: '/images/testimonials/avatar4.jpg',
            date: '3 июня 2024',
            isFeatured: false,
            createdAt: new Date('2024-06-03').toISOString(),
        },
        {
            name: 'Дмитрий Волков',
            rating: 5,
            text: 'Заказывал корпоративные браслеты с логотипом компании. Получилось отлично, все коллеги в восторге! Обязательно закажу еще.',
            image: '/images/testimonials/avatar5.jpg',
            date: '17 июня 2024',
            isFeatured: true,
            createdAt: new Date('2024-06-17').toISOString(),
        },
        {
            name: 'Екатерина Новикова',
            rating: 5,
            text: 'Прекрасное качество изделий! Заказала браслет и шнурок для ножа. Все супер, плетение крепкое и аккуратное.',
            image: '/images/testimonials/avatar6.jpg',
            date: '29 июня 2024',
            isFeatured: true,
            createdAt: new Date('2024-06-29').toISOString(),
        },
        {
            name: 'Игорь Морозов',
            rating: 4,
            text: 'Хорошие браслеты, материал качественный. Заказывал несколько штук для друзей. Все довольны результатом.',
            image: '/images/testimonials/avatar7.jpg',
            date: '12 июля 2024',
            isFeatured: false,
            createdAt: new Date('2024-07-12').toISOString(),
        },
        {
            name: 'Ольга Соколова',
            rating: 5,
            text: 'Потрясающая работа! Заказывала именной браслет с гравировкой. Получилось очень красиво и качественно. Спасибо!',
            image: '/images/testimonials/avatar8.jpg',
            date: '25 июля 2024',
            isFeatured: true,
            createdAt: new Date('2024-07-25').toISOString(),
        },
        {
            name: 'Андрей Федоров',
            rating: 4,
            text: 'Отличный магазин военной атрибутики. Купил шевроны и браслет. Качество хорошее, цены приемлемые.',
            image: '/images/testimonials/avatar9.jpg',
            date: '5 августа 2024',
            isFeatured: false,
            createdAt: new Date('2024-08-05').toISOString(),
        },
        {
            name: 'Татьяна Лебедева',
            rating: 5,
            text: 'Заказывала браслет в подарок сыну на день рождения. Качество превзошло ожидания! Сын в восторге, носит не снимая.',
            image: '/images/testimonials/avatar10.jpg',
            date: '18 августа 2024',
            isFeatured: false,
            createdAt: new Date('2024-08-18').toISOString(),
        },
    ];

    await db.insert(testimonials).values(sampleTestimonials);
    
    console.log('✅ Testimonials seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});