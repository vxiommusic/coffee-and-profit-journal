export type Trade = {
  id: string;
  instrument: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  size: number;
  entryDate: string;
  exitDate: string;
  status: 'Open' | 'Closed';
  pnl: number;
  notes?: string;
  chartImageId: string;
};
