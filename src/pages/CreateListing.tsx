import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { categories } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const LISTINGS_URL = 'https://functions.poehali.dev/7f51f02d-a3ab-4595-875d-a6d8613537cf';

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: categories[1],
    price: '',
    description: '',
    location: '',
    condition: 'Новое',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(LISTINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          description: form.description,
          location: form.location,
          condition: form.condition,
          seller: user?.name || 'Пользователь',
          image_base64: imageBase64,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка публикации');
      }

      toast.success('Объявление опубликовано');
      navigate('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Не удалось опубликовать объявление');
    } finally {
      setSubmitting(false);
    }
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

          <div>
            <label className="mb-2 block text-sm font-medium">Фото</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-border">
                <img src={imagePreview} alt="Превью" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-[3/1] w-full items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <div className="text-center">
                  <Icon name="ImagePlus" size={28} className="mx-auto mb-2" />
                  Добавить фото
                </div>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              <Icon name="Loader2" size={18} className="animate-spin" />
            ) : (
              <Icon name="Check" size={18} />
            )}
            {submitting ? 'Публикация...' : 'Опубликовать объявление'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
