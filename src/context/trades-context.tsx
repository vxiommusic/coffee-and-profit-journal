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

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Этот useEffect выполняется один раз на клиенте для загрузки данных
  useEffect(() => {
    try {
      const savedTrades = localStorage.getItem('trades');
      if (savedTrades) {
        setTrades(JSON.parse(savedTrades));
      } else {
        // Если в localStorage ничего нет, загружаем данные по умолчанию
        setTrades(mockTrades);
      }
    } catch (error) {
      console.error('Error reading trades from localStorage', error);
      // В случае ошибки загружаем данные по умолчанию
      setTrades(mockTrades);
    } finally {
      setIsInitialized(true);
    }
  }, []); // Пустой массив зависимостей гарантирует, что это выполнится только один раз

  // Этот useEffect сохраняет данные в localStorage при их изменении
  useEffect(() => {
    // Мы сохраняем данные только после того, как они были инициализированы
    if (isInitialized) {
      try {
        localStorage.setItem('trades', JSON.stringify(trades));
      } catch (error) {
        console.error('Error saving trades to localStorage', error);
      }
    }
  }, [trades, isInitialized]); // Зависимость от 'trades' и 'isInitialized'

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
