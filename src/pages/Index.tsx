import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';
import { products, categories } from '@/data/products';

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState<'default' | 'asc' | 'desc'>('default');

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
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="container py-20 text-center md:py-32">
          <h1 className="font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Меньше вещей —<br />больше смысла
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
            Тщательно отобранные предметы для дома и жизни. Чистые формы,
            качественные материалы, ничего лишнего.
          </p>
        </div>
      </section>

      <main className="container py-12">
        <div className="mb-10 flex flex-col gap-6">
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
              placeholder="Поиск товаров..."
              className="h-12 w-full rounded-md border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    category === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
            >
              <option value="default">По умолчанию</option>
              <option value="asc">Сначала дешёвые</option>
              <option value="desc">Сначала дорогие</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Icon
              name="SearchX"
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <p className="text-muted-foreground">Ничего не найдено</p>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground md:flex-row">
          <p className="font-display text-lg text-foreground">MINIM</p>
          <p>© 2026 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
