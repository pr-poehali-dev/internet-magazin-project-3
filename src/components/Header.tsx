import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          MINIM
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Каталог
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/account')}
            className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            aria-label="Личный кабинет"
          >
            <Icon name={user ? 'UserCheck' : 'User'} size={20} />
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            aria-label="Корзина"
          >
            <Icon name="ShoppingBag" size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
