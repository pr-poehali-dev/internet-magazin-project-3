import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-md bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
            Нет в наличии
          </span>
        )}
        {product.inStock && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 hover:scale-110 group-hover:opacity-100"
            aria-label="В корзину"
          >
            <Icon name="Plus" size={18} />
          </button>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-sm font-semibold">{product.price.toLocaleString('ru-RU')} ₽</p>
      </div>
    </Link>
  );
};

export default ProductCard;
