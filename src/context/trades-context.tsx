'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Trade } from '@/lib/types';
import { mockTrades } from '@/lib/data';

interface TradesContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);

  const addTrade = (trade: Trade) => {
    setTrades((prevTrades) => [trade, ...prevTrades]);
  };

  const deleteTrade = (tradeId: string) => {
    setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== tradeId));
  };

  return (
    <TradesContext.Provider value={{ trades, addTrade, deleteTrade }}>
      {children}
    </TradesContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
}
