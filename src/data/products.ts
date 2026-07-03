export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
}

export const categories = [
  'Все',
  'Посуда',
  'Электроника',
  'Освещение',
  'Аксессуары',
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Керамическая кружка',
    price: 1290,
    category: 'Посуда',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/8156cd83-027b-437d-ac53-9e64badaf7a6.jpg',
    description: 'Матовая керамическая кружка бежевого цвета объёмом 350 мл. Приятная на ощупь, сохраняет тепло напитка. Подходит для микроволновки и посудомоечной машины.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Беспроводные наушники',
    price: 6990,
    category: 'Электроника',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/259b60e0-5792-4793-8809-367f81317a37.jpg',
    description: 'Лёгкие беспроводные наушники с чистым звуком и активным шумоподавлением. До 30 часов работы от одного заряда.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Настольная лампа',
    price: 3490,
    category: 'Освещение',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/5f2d3cd9-95ec-40dd-8e44-b6280cf26c9a.jpg',
    description: 'Минималистичная настольная лампа в матовом чёрном корпусе. Регулируемая яркость и тёплый свет для комфортной работы.',
    inStock: true,
  },
  {
    id: 4,
    name: 'Холщовая сумка',
    price: 990,
    category: 'Аксессуары',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/a0dcaa10-fa54-4c03-9da7-5ce6343119ac.jpg',
    description: 'Прочная холщовая сумка-шоппер натурального цвета. Вместительная и экологичная — идеальна для повседневных покупок.',
    inStock: true,
  },
  {
    id: 5,
    name: 'Керамическая кружка (набор 2 шт)',
    price: 2290,
    category: 'Посуда',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/8156cd83-027b-437d-ac53-9e64badaf7a6.jpg',
    description: 'Набор из двух матовых керамических кружек бежевого цвета. Отличный подарок для дома.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Наушники Pro',
    price: 9990,
    category: 'Электроника',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/259b60e0-5792-4793-8809-367f81317a37.jpg',
    description: 'Флагманская модель наушников с премиальным звучанием и продвинутым шумоподавлением. До 40 часов автономной работы.',
    inStock: false,
  },
  {
    id: 7,
    name: 'Лампа с диммером',
    price: 4290,
    category: 'Освещение',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/5f2d3cd9-95ec-40dd-8e44-b6280cf26c9a.jpg',
    description: 'Настольная лампа с плавным диммером и сенсорным управлением. Пять уровней яркости для любой задачи.',
    inStock: true,
  },
  {
    id: 8,
    name: 'Сумка-шоппер XL',
    price: 1290,
    category: 'Аксессуары',
    image: 'https://cdn.poehali.dev/projects/02859ca9-55b5-41c1-bd98-7fca0e6d9701/files/a0dcaa10-fa54-4c03-9da7-5ce6343119ac.jpg',
    description: 'Увеличенная холщовая сумка с усиленными ручками. Выдерживает до 15 кг.',
    inStock: true,
  },
];

export const getProductById = (id: number): Product | undefined =>
  products.find((p) => p.id === id);

export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
