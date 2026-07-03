import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container flex h-16 items-center gap-6">
        <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icon name="ShoppingBag" size={16} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            OBYAVA
          </span>
        </Link>

        <button className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex flex-shrink-0">
          <Icon name="MapPin" size={16} className="text-primary" />
          Москва
          <Icon name="ChevronDown" size={14} />
        </button>

        <div className="relative hidden flex-1 md:block">
          <Icon
            name="Search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Найти что угодно..."
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => navigate('/account')}
            className="flex h-10 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-secondary"
            aria-label="Личный кабинет"
          >
            <Icon name={user ? 'UserCheck' : 'User'} size={20} />
            <span className="hidden lg:inline">{user ? user.name : 'Войти'}</span>
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
            aria-label="Корзина"
          >
            <Icon name="Heart" size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/')}
            className="ml-2 hidden h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:flex"
          >
            <Icon name="Plus" size={16} />
            Разместить
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
