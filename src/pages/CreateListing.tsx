import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { categories } from '@/data/products';
import { toast } from 'sonner';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    category: categories[1],
    price: '',
    description: '',
    location: '',
    condition: 'Новое',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Объявление отправлено на публикацию');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <Header />
      <main className="container max-w-2xl py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>

        <h1 className="mb-1 font-display text-3xl font-semibold tracking-tight">
          Разместить объявление
        </h1>
        <p className="mb-8 text-muted-foreground">
          Заполните информацию о товаре или услуге
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Название</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Например, iPhone 13 Pro"
              className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-12 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                {categories.filter((c) => c !== 'Все').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Состояние</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="h-12 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="Новое">Новое</option>
                <option value="Б/у">Б/у</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Цена, ₽</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Описание</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Расскажите подробнее о товаре"
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Местоположение</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Город, район"
              className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex aspect-[3/1] items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
            <div className="text-center">
              <Icon name="ImagePlus" size={28} className="mx-auto mb-2" />
              Добавить фото
            </div>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon name="Check" size={18} />
            Опубликовать объявление
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
