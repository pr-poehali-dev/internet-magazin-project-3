import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';
import { getProductById, getRelatedProducts, Product as ProductType } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const LISTINGS_URL = 'https://functions.poehali.dev/7f51f02d-a3ab-4595-875d-a6d8613537cf';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [dbProduct, setDbProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);

  const numericId = Number(id);
  const isDbListing = numericId > 100000;
  const staticProduct = isDbListing ? undefined : getProductById(numericId);
  const product = isDbListing ? dbProduct : staticProduct;

  useEffect(() => {
    if (!isDbListing) return;
    setLoading(true);
    fetch(LISTINGS_URL)
      .then((res) => res.json())
      .then((data) => {
        const found = (data.listings || []).find(
          (l: ProductType) => l.id + 100000 === numericId
        );
        setDbProduct(found ? { ...found, id: found.id + 100000 } : null);
      })
      .catch(() => setDbProduct(null))
      .finally(() => setLoading(false));
  }, [numericId, isDbListing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/40">
        <Header />
        <div className="container py-24 text-center text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary/40">
        <Header />
        <div className="container py-24 text-center">
          <p className="mb-4 text-muted-foreground">Объявление не найдено</p>
          <Link to="/" className="text-sm text-primary underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const related = isDbListing ? [] : getRelatedProducts(product);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <Header />

      <main className="container py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад к объявлениям
        </button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] bg-secondary">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Icon name="ImageOff" size={32} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-3 font-display text-xl font-semibold">Описание</h2>
              <p className="leading-relaxed text-foreground/80">
                {product.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Категория</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Состояние</p>
                  <p className="font-medium">{product.condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Просмотры</p>
                  <p className="font-medium">{product.views}</p>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
                  Похожие объявления
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {related.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="text-3xl font-bold">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                  <button
                    onClick={() => setLiked((v) => !v)}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                    aria-label="В избранное"
                  >
                    <Icon
                      name="Heart"
                      size={18}
                      className={liked ? 'fill-primary text-primary' : 'text-muted-foreground'}
                    />
                  </button>
                </div>
                <h1 className="mb-3 font-display text-lg font-semibold leading-snug">
                  {product.name}
                </h1>
                <div className="mb-5 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={15} />
                    {product.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={15} />
                    {product.date}
                  </div>
                </div>

                {product.inStock ? (
                  <button
                    onClick={handleAdd}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Icon name="ShoppingBag" size={18} />
                    Добавить в корзину
                  </button>
                ) : (
                  <div className="flex h-12 items-center justify-center rounded-lg bg-secondary text-sm text-muted-foreground">
                    Товар продан
                  </div>
                )}
                <button className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary text-sm font-medium text-primary transition-colors hover:bg-accent">
                  <Icon name="MessageCircle" size={18} />
                  Написать продавцу
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Продавец
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon name="Store" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{product.seller}</p>
                    <p className="text-xs text-muted-foreground">На сайте с 2023 года</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
