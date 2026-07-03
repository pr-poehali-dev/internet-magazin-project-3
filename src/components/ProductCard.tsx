import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useState } from 'react';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked((v) => !v);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={handleLike}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
          aria-label="В избранное"
        >
          <Icon
            name="Heart"
            size={17}
            className={liked ? 'fill-primary text-primary' : 'text-muted-foreground'}
          />
        </button>
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-md bg-foreground/80 px-2 py-1 text-xs text-background">
            Продано
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-lg font-semibold leading-none">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
        <h3 className="line-clamp-2 text-sm leading-snug text-foreground/90">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">{product.location}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">{product.date}</p>
          {product.inStock && (
            <button
              onClick={handleAdd}
              className="rounded-md border border-primary px-2 py-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
