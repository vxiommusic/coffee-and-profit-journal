export type Trade = {
  id: string;
  instrument: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  entryDate: string;
  exitDate: string | null;
  pnl: number | null;
  notes?: string;
  chartImageId: string;
};
