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
  chartImageUrl: string | null;
  commission?: number | null;
};

export type Note = {
  id: string;
  title: string;
  description: string;
  screenshotUrl: string | null;
  createdAt: string;
};
