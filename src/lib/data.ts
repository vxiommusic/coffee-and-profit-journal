import type { Trade } from './types';
import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
  return PlaceHolderImages.find(p => p.id === id)?.imageUrl ?? null;
}

export const mockTrades: Trade[] = [
  {
    id: '1',
    instrument: 'NVDA',
    type: 'Long',
    entryPrice: 900.5,
    exitPrice: 950.75,
    size: 10,
    entryDate: '2024-05-20T09:30:00Z',
    exitDate: '2024-05-20T14:00:00Z',
    pnl: 502.5,
    notes: 'Поймал утренний всплеск на новостях об ИИ. Хорошее исполнение.',
    chartImageUrl: getImageUrl('chart-1'),
  },
  {
    id: '2',
    instrument: 'BTC/USD',
    type: 'Short',
    entryPrice: 68500,
    exitPrice: 67200,
    size: 0.5,
    entryDate: '2024-05-21T11:00:00Z',
    exitDate: '2024-05-21T18:45:00Z',
    pnl: 650,
    notes: 'Продажа от уровня сопротивления 69k. Сработало как и планировалось.',
    chartImageUrl: getImageUrl('chart-2'),
  },
  {
    id: '3',
    instrument: 'ETH/USD',
    type: 'Long',
    entryPrice: 3800,
    exitPrice: 3750,
    size: 2,
    entryDate: '2024-05-22T08:00:00Z',
    exitDate: '2024-05-22T10:15:00Z',
    pnl: -100,
    notes: 'Вошел слишком рано, выбило по стопу на фитиле.',
    chartImageUrl: getImageUrl('chart-3'),
  },
  {
    id: '4',
    instrument: 'TSLA',
    type: 'Long',
    entryPrice: 175,
    exitPrice: null,
    size: 20,
    entryDate: '2024-05-23T10:00:00Z',
    exitDate: null,
    pnl: null,
    notes: 'Вход на основе сильной поддержки и бычьей дивергенции.',
    chartImageUrl: getImageUrl('chart-4'),
  },
  {
    id: '5',
    instrument: 'SPY',
    type: 'Short',
    entryPrice: 530.1,
    exitPrice: 528.2,
    size: 50,
    entryDate: '2024-05-24T13:00:00Z',
    exitDate: '2024-05-24T15:30:00Z',
    pnl: 95,
    notes: 'Быстрый скальп во время дневной консолидации.',
    chartImageUrl: getImageUrl('chart-5'),
  },
];
