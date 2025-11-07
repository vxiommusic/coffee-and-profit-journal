
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Trade } from '@/lib/types';
import { mockTrades } from '@/lib/data';

interface TradesContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

const getInitialTrades = (): Trade[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const savedTrades = localStorage.getItem('trades');
    if (savedTrades) {
      return JSON.parse(savedTrades);
    }
    // Если localStorage пуст, используем mockTrades
    localStorage.setItem('trades', JSON.stringify(mockTrades));
    return mockTrades;
  } catch (error) {
    console.error('Error reading or setting trades in localStorage, using mock trades.', error);
    return mockTrades;
  }
};


export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    setTrades(getInitialTrades());
  }, []);

  useEffect(() => {
    // Этот useEffect сработает только после инициализации и при реальных изменениях
    // Предотвращаем затирание localStorage пустым массивом при первом рендере
    if (trades.length > 0 || localStorage.getItem('trades')) {
       try {
        localStorage.setItem('trades', JSON.stringify(trades));
      } catch (error) {
        console.error('Error saving trades to localStorage', error);
      }
    }
  }, [trades]);


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
