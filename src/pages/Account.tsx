import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const statusColor: Record<string, string> = {
  Оформлен: 'bg-secondary text-foreground',
  'В обработке': 'bg-secondary text-foreground',
  Отправлен: 'bg-secondary text-foreground',
  Доставлен: 'bg-primary text-primary-foreground',
};

const Account = () => {
  const { user, login, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [newsletter, setNewsletter] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login(form.email, form.name);
    if (newsletter) {
      toast.success('Вы подписаны на уведомления о новинках');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex justify-center py-16">
          <div className="w-full max-w-sm">
            <h1 className="mb-2 text-center font-display text-3xl font-semibold tracking-tight">
              Вход и регистрация
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Войдите, чтобы отслеживать заказы
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Имя</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
                  placeholder="Иван"
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
              <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                Получать письма о статусе заказов и новинках
              </label>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Войти
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Привет, {user.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>

        <h2 className="mb-6 font-display text-2xl font-semibold">История заказов</h2>

        {user.orders.length === 0 ? (
          <div className="rounded-md border border-dashed border-border py-16 text-center">
            <Icon
              name="Package"
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <p className="mb-6 text-muted-foreground">У вас пока нет заказов</p>
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Начать покупки
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div key={order.id} className="rounded-md border border-border p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Заказ {order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusColor[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 border-t border-border pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
                  <span>Итого</span>
                  <span>{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Account;
