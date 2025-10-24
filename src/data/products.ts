export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  featured: boolean;
  material?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Кожаный браслет с пластиной',
    price: 1200,
    description: 'Стильный браслет из натуральной кожи с металлической пластиной для гравировки. Регулируемый размер, застежка-карабин. Идеальный подарок для близкого человека.',
    category: 'Браслеты',
    material: 'Кожа, металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/premium-black-leather-bracelet-with-engr-6e7a211b-20251021102726.jpg',
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/premium-black-leather-bracelet-with-engr-6506286b-20251021102723.jpg',
    ],
    featured: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Металлический жетон армейский',
    price: 800,
    description: 'Классический армейский жетон из нержавеющей стали. Размер пластины 15×40 мм. Возможна гравировка с двух сторон. Включает цепочку.',
    category: 'Жетоны',
    material: 'Нержавеющая сталь',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/military-style-dog-tag-necklace-with-rus-0dc52df6-20251021102724.jpg',
    ],
    featured: true,
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Брелок с гравировкой прямоугольный',
    price: 600,
    description: 'Компактный металлический брелок для ключей. Прочное кольцо, устойчивая к истиранию гравировка. Размер 30×20 мм.',
    category: 'Брелоки',
    material: 'Металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/metal-keychain-with-engraved-rectangular-f24c804a-20251021102728.jpg',
    ],
    featured: true,
    isNew: true,
  },
  {
    id: '4',
    name: 'Подарочная деревянная коробка',
    price: 2500,
    description: 'Элегантная коробка из натурального дерева с гравировкой на крышке. Внутри велюровая подкладка. Размер: 15×10×5 см. Идеально для украшений.',
    category: 'Коробочки',
    material: 'Дерево, велюр',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/elegant-wooden-gift-box-with-engraved-li-5c1cb72e-20251021102726.jpg',
    ],
    featured: true,
    isBestseller: true,
  },
  {
    id: '5',
    name: 'Браслет из паракорда с пластиной',
    price: 950,
    description: 'Плетёный браслет из прочного паракорда с металлической пластиной для гравировки. Доступны цвета: чёрный, хаки, синий. Регулируемый размер.',
    category: 'Браслеты',
    material: 'Паракорд, металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/braided-black-paracord-bracelet-with-eng-ba6b2c27-20251021102728.jpg',
    ],
    featured: false,
    isNew: true,
  },
  {
    id: '6',
    name: 'Жетон круглый с цепочкой',
    price: 850,
    description: 'Круглый металлический жетон диаметром 25 мм. Гравировка с одной стороны. В комплекте стальная цепочка 60 см.',
    category: 'Жетоны',
    material: 'Металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/round-metal-dog-tag-pendant-with-chain-t-6f9df25c-20251021102727.jpg',
    ],
    featured: false,
  },
  {
    id: '7',
    name: 'Брелок кожаный овальный',
    price: 750,
    description: 'Стильный брелок из натуральной кожи с металлической вставкой для гравировки. Ручная работа, доступны цвета: коричневый, чёрный.',
    category: 'Брелоки',
    material: 'Кожа, металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/oval-brown-leather-keychain-with-engrave-343c03c0-20251021102726.jpg',
    ],
    featured: false,
    isBestseller: true,
  },
  {
    id: '8',
    name: 'Шкатулка резная большая',
    price: 3800,
    description: 'Роскошная деревянная шкатулка с резным орнаментом. Гравировка на крышке и внутри. Размер: 20×15×8 см. Отделения для украшений.',
    category: 'Коробочки',
    material: 'Дерево',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/large-carved-wooden-jewelry-box-with-orn-69a84f43-20251021102727.jpg',
    ],
    featured: false,
    isNew: true,
  },
  {
    id: '9',
    name: 'Браслет силиконовый с пластиной',
    price: 550,
    description: 'Спортивный браслет из медицинского силикона с металлической пластиной. Водостойкий, гипоаллергенный. Несколько размеров.',
    category: 'Браслеты',
    material: 'Силикон, металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/black-silicone-sport-bracelet-with-engra-53e49338-20251021102727.jpg',
    ],
    featured: false,
  },
  {
    id: '10',
    name: 'Брелок с QR-кодом',
    price: 900,
    description: 'Уникальный брелок с гравировкой QR-кода и текста. Можно закодировать контакты, ссылку или сообщение. Нержавеющая сталь.',
    category: 'Брелоки',
    material: 'Нержавеющая сталь',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/metal-keychain-with-engraved-qr-code-tex-1e9bcaaa-20251021102726.jpg',
    ],
    featured: false,
    isNew: true,
  },
  {
    id: '11',
    name: 'Жетон сердце влюблённым',
    price: 1100,
    description: 'Романтический жетон в форме сердца. Можно разделить на две половинки. Гравировка имён, дат. Цепочки в комплекте.',
    category: 'Жетоны',
    material: 'Металл',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/heart-shaped-metal-dog-tag-necklace-for--281351f8-20251021102725.jpg',
    ],
    featured: false,
    isBestseller: true,
  },
  {
    id: '12',
    name: 'Коробка для часов с гравировкой',
    price: 3200,
    description: 'Премиальная коробка для хранения часов. Гравировка на крышке, мягкая подушечка внутри. Размер: 12×12×8 см.',
    category: 'Коробочки',
    material: 'Дерево, кожзам',
    images: [
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/300b13ea-ce26-44c8-bc03-eb473ed8800d/generated_images/premium-wooden-watch-box-with-engraved-l-55a44752-20251021102730.jpg',
    ],
    featured: false,
  },
];

export const categories = [
  'Все',
  'Браслеты',
  'Жетоны',
  'Брелоки',
  'Коробочки',
];

export const materials = [
  'Все материалы',
  'Кожа',
  'Металл',
  'Дерево',
  'Паракорд',
  'Силикон',
  'Нержавеющая сталь',
];

export const fonts = [
  { value: 'arial', label: 'Arial', fontFamily: 'Arial, sans-serif' },
  { value: 'times', label: 'Times New Roman', fontFamily: '"Times New Roman", serif' },
  { value: 'courier', label: 'Courier New', fontFamily: '"Courier New", monospace' },
  { value: 'script', label: 'Скриптовый', fontFamily: 'cursive' },
  { value: 'gothic', label: 'Готический', fontFamily: 'fantasy' },
];