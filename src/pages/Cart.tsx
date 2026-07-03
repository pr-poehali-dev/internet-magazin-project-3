import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useAuth, Order } from '@/context/AuthContext';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, login, addOrder } = useAuth();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });

  const delivery = totalPrice >= 3000 || totalPrice === 0 ? 0 : 300;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) login(form.email, form.name);

    const order: Order = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('ru-RU'),
      items,
      total: totalPrice + delivery,
      status: 'Оформлен',
    };
    addOrder(order);
    clearCart();
    toast.success('Заказ оформлен! Уведомление отправлено на почту');
    navigate('/account');
  };

  if (items.length === 0 && !checkout) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <Icon
            name="ShoppingBag"
            size={48}
            className="mx-auto mb-6 text-muted-foreground"
          />
          <h1 className="mb-2 font-display text-3xl font-semibold">
            Корзина пуста
          </h1>
          <p className="mb-8 text-muted-foreground">
            Добавьте товары из каталога
          </p>
          <Link
            to="/"
            className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <h1 className="mb-10 font-display text-4xl font-semibold tracking-tight">
          {checkout ? 'Оформление заказа' : 'Корзина'}
        </h1>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {!checkout ? (
              <div className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-6">
                    <Link
                      to={`/product/${item.id}`}
                      className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-secondary"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Удалить"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
                          >
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
                          >
                            <Icon name="Plus" size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleOrder} className="space-y-4" id="checkout-form">
                <div>
                  <label className="mb-2 block text-sm font-medium">Имя</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                    placeholder="mail@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Адрес доставки
                  </label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                    placeholder="Город, улица, дом"
                  />
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">Итого</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Товары</span>
                  <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>
                    {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <span>К оплате</span>
                  <span>{(totalPrice + delivery).toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {!checkout ? (
                <button
                  onClick={() => setCheckout(true)}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Оформить заказ
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Подтвердить заказ
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
