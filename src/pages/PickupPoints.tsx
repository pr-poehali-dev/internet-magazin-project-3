import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { pickupPoints, useLocationCtx } from '@/context/LocationContext';
import { toast } from 'sonner';

const PickupPoints = () => {
  const navigate = useNavigate();
  const { city, selectedPickup, setSelectedPickup } = useLocationCtx();

  const filtered = pickupPoints.filter((p) => city === 'Вся Россия' || p.city === city);

  const handleSelect = (point: typeof pickupPoints[number]) => {
    setSelectedPickup(point);
    toast.success(`Пункт выдачи выбран: ${point.name}`);
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
          Пункты выдачи
        </h1>
        <p className="mb-8 text-muted-foreground">
          Выберите удобный пункт выдачи в городе «{city}»
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
            В этом городе пока нет пунктов выдачи
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((point) => {
              const active = selectedPickup?.id === point.id;
              return (
                <button
                  key={point.id}
                  onClick={() => handleSelect(point)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors ${
                    active
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}
                  >
                    <Icon name="Store" size={20} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{point.name}</h3>
                      {active && <Icon name="CheckCircle2" size={18} className="text-primary" />}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{point.address}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={13} />
                      {point.hours}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PickupPoints;