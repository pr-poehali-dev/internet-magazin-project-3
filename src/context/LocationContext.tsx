import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface PickupPoint {
  id: number;
  name: string;
  address: string;
  city: string;
  hours: string;
}

export const pickupPoints: PickupPoint[] = [
  {
    id: 1,
    name: 'ПВЗ на Тверской',
    address: 'ул. Тверская, 12',
    city: 'Москва',
    hours: '09:00 – 21:00',
  },
  {
    id: 2,
    name: 'ПВЗ Хамовники',
    address: 'ул. Льва Толстого, 5',
    city: 'Москва',
    hours: '10:00 – 20:00',
  },
  {
    id: 3,
    name: 'ПВЗ Невский проспект',
    address: 'Невский пр-т, 30',
    city: 'Санкт-Петербург',
    hours: '09:00 – 22:00',
  },
  {
    id: 4,
    name: 'ПВЗ Вахитовский',
    address: 'ул. Баумана, 8',
    city: 'Казань',
    hours: '10:00 – 20:00',
  },
  {
    id: 5,
    name: 'ПВЗ Центральный',
    address: 'Красный проспект, 15',
    city: 'Новосибирск',
    hours: '09:00 – 21:00',
  },
];

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
  selectedPickup: PickupPoint | null;
  setSelectedPickup: (point: PickupPoint | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string>(() => localStorage.getItem('city') || 'Москва');
  const [selectedPickup, setSelectedPickupState] = useState<PickupPoint | null>(() => {
    const saved = localStorage.getItem('pickup');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('city', city);
  }, [city]);

  useEffect(() => {
    if (selectedPickup) localStorage.setItem('pickup', JSON.stringify(selectedPickup));
    else localStorage.removeItem('pickup');
  }, [selectedPickup]);

  const setCity = (c: string) => setCityState(c);
  const setSelectedPickup = (p: PickupPoint | null) => setSelectedPickupState(p);

  return (
    <LocationContext.Provider value={{ city, setCity, selectedPickup, setSelectedPickup }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationCtx = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationCtx must be used within LocationProvider');
  return ctx;
};
