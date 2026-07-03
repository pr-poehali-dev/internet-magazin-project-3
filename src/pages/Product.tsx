import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <p className="mb-4 text-muted-foreground">Товар не найден</p>
          <Link to="/" className="text-sm underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedProducts(product);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-md bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8">
              {product.inStock ? (
                <button
                  onClick={handleAdd}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:w-auto md:px-12"
                >
                  <Icon name="ShoppingBag" size={18} />
                  Добавить в корзину
                </button>
              ) : (
                <div className="flex h-14 items-center justify-center rounded-md bg-secondary text-sm text-muted-foreground md:w-auto md:px-12">
                  Нет в наличии
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Icon name="Truck" size={18} />
                Бесплатная доставка от 3000 ₽
              </div>
              <div className="flex items-center gap-3">
                <Icon name="RotateCcw" size={18} />
                Возврат в течение 14 дней
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
              Похожие товары
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Product;
