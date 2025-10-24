import { db } from '@/db';
import { galleryWorks } from '@/db/schema';

async function main() {
    const sampleGalleryWorks = [
        {
            image: '/images/gallery/work1.jpg',
            title: 'Индивидуальный заказ браслета для военнослужащего',
            orderIndex: 0,
            createdAt: new Date('2024-02-15').toISOString(),
        },
        {
            image: '/images/gallery/work2.jpg',
            title: 'Корпоративный заказ: 50 браслетов с логотипом',
            orderIndex: 1,
            createdAt: new Date('2024-03-10').toISOString(),
        },
        {
            image: '/images/gallery/work3.jpg',
            title: 'Подарочный набор: жетон + браслет + коробка',
            orderIndex: 2,
            createdAt: new Date('2024-04-05').toISOString(),
        },
        {
            image: '/images/gallery/work4.jpg',
            title: 'Тактический EDC-набор для похода',
            orderIndex: 3,
            createdAt: new Date('2024-05-20').toISOString(),
        },
        {
            image: '/images/gallery/work5.jpg',
            title: 'Свадебные браслеты для пары',
            orderIndex: 4,
            createdAt: new Date('2024-06-12').toISOString(),
        },
        {
            image: '/images/gallery/work6.jpg',
            title: 'Эксклюзивный браслет из паракорда с компасом',
            orderIndex: 5,
            createdAt: new Date('2024-07-08').toISOString(),
        },
        {
            image: '/images/gallery/work7.jpg',
            title: 'Мемориальные жетоны для ветеранов',
            orderIndex: 6,
            createdAt: new Date('2024-08-22').toISOString(),
        },
        {
            image: '/images/gallery/work8.jpg',
            title: 'Корпоративные подарки для сотрудников МЧС',
            orderIndex: 7,
            createdAt: new Date('2024-09-15').toISOString(),
        }
    ];

    await db.insert(galleryWorks).values(sampleGalleryWorks);
    
    console.log('✅ Gallery works seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});