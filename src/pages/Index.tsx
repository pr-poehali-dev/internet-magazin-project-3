import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';
import { products as staticProducts, categories, Product } from '@/data/products';

const LISTINGS_URL = 'https://functions.poehali.dev/7f51f02d-a3ab-4595-875d-a6d8613537cf';

const categoryIcons: Record<string, string> = {
  Все: 'LayoutGrid',
  Транспорт: 'Car',
  Недвижимость: 'Home',
  Работа: 'Briefcase',
  Электроника: 'Headphones',
  'Дом и сад': 'Lamp',
  'Личные вещи': 'Shirt',
  Животные: 'PawPrint',
  'Хобби и отдых': 'Bike',
  Услуги: 'Wrench',
  Детям: 'Baby',
  'Бытовая техника': 'Refrigerator',
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [dbListings, setDbListings] = useState<Product[]>([]);

  useEffect(() => {
    fetch(LISTINGS_URL)
      .then((res) => res.json())
      .then((data) =>
        setDbListings(
          (data.listings || []).map((l: Product) => ({ ...l, id: l.id + 100000 }))
        )
      )
      .catch(() => setDbListings([]));
  }, []);

  const products = useMemo(() => [...dbListings, ...staticProducts], [dbListings]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === 'Все' || p.category === category;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sort === 'asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'desc') result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <Header />

      <div className="md:hidden container pt-4">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти что угодно..."
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <main className="container flex gap-6 py-6">
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-3">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Категории
            </p>
            <nav className="space-y-0.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                    category === c
                      ? 'bg-accent font-medium text-accent-foreground'
                      : 'text-foreground/80 hover:bg-secondary'
                  }`}
                >
                  <Icon name={categoryIcons[c] || 'Circle'} size={17} />
                  {c}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 hidden md:block">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по объявлениям..."
                className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {category === 'Все' ? 'Все объявления' : category}
              </h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'объявление' : 'объявлений'}
              </p>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="default">По умолчанию</option>
              <option value="asc">Сначала дешёвые</option>
              <option value="desc">Сначала дорогие</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 md:hidden mb-5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  category === c
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-24 text-center">
              <Icon
                name="SearchX"
                size={40}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-10 border-t border-border bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p className="font-display text-lg text-foreground">OBYAVA</p>
          <p>© 2026 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;