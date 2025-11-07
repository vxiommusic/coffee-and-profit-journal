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

// Функция для ленивой инициализации состояния из localStorage
const getInitialTrades = (): Trade[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const savedTrades = localStorage.getItem('trades');
    // Если в localStorage что-то есть, используем это
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

  // Этот хук выполнится один раз на клиенте для безопасной загрузки данных
  useEffect(() => {
    setTrades(getInitialTrades());
  }, []);

  // Этот хук сохраняет данные при любом их изменении
  useEffect(() => {
    // Не сохраняем начальное пустое состояние, чтобы не затереть localStorage
    if (trades.length > 0) {
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
    const newTrades = trades.filter((trade) => trade.id !== tradeId);
    setTrades(newTrades);
    // Принудительно сохраняем в localStorage, даже если массив стал пустым
    try {
        localStorage.setItem('trades', JSON.stringify(newTrades));
    } catch (error) {
        console.error('Error saving trades to localStorage after deletion', error);
    }
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
