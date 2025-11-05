'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTrades } from '@/lib/data';
import type { Trade } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Trash2, Upload, PlusCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { NewTradeDialog } from '@/components/new-trade-dialog';
import Image from 'next/image';

// Компонент для форматирования даты на стороне клиента, чтобы избежать ошибок гидратации
function ClientFormattedDate({ dateString }: { dateString: string | null }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (dateString) {
      setFormattedDate(format(parseISO(dateString), 'PPpp', { locale: ru }));
    } else {
      setFormattedDate('-');
    }
  }, [dateString]);

  return <>{formattedDate}</>;
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isNewTradeOpen, setIsNewTradeOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddTrade = (trade: Trade) => {
    setTrades((prevTrades) => [trade, ...prevTrades]);
    toast({
      title: 'Сделка добавлена',
      description: `Сделка для ${trade.instrument} была успешно добавлена.`,
    });
  };

  const handleDelete = () => {
    if (tradeToDelete) {
      setTrades(trades.filter((trade) => trade.id !== tradeToDelete.id));
      toast({
        title: 'Сделка удалена',
        description: `Сделка для ${tradeToDelete.instrument} была успешно удалена.`,
      });
      setTradeToDelete(null);
    }
  };

  return (
    <>
      <Card className="animate-in fade-in-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Все сделки</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Фильтр
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Импорт
            </Button>
            <Button onClick={() => setIsNewTradeOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Новая сделка
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Инструмент</TableHead>
                <TableHead>График</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Цена входа</TableHead>
                <TableHead>Цена выхода</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Дата входа</TableHead>
                <TableHead className="text-right">P/L</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">
                    {trade.instrument}
                  </TableCell>
                  <TableCell>
                    {trade.chartImageUrl && (
                       <Image
                        src={trade.chartImageUrl}
                        alt={`График для ${trade.instrument}`}
                        width={100}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        trade.type === 'Long'
                          ? 'text-chart-2 border-chart-2'
                          : 'text-chart-5 border-chart-5'
                      }
                    >
                      {trade.type === 'Long' ? 'Длинная' : 'Короткая'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    ${trade.entryPrice.toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell className="font-mono">
                    {trade.exitPrice !== null
                      ? `$${trade.exitPrice.toLocaleString('ru-RU')}`
                      : '-'}
                  </TableCell>
                  <TableCell className="font-mono">{trade.size}</TableCell>
                  <TableCell>
                    {isClient ? <ClientFormattedDate dateString={trade.entryDate} /> : null}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono ${
                      trade.pnl !== null && trade.pnl > 0
                        ? 'text-chart-2'
                        : trade.pnl !== null && trade.pnl < 0
                        ? 'text-chart-5'
                        : 'text-foreground'
                    }`}
                  >
                    {trade.pnl !== null
                      ? `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog open={tradeToDelete?.id === trade.id} onOpenChange={(open) => !open && setTradeToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTradeToDelete(trade)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие не может быть отменено. Это навсегда удалит вашу сделку.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NewTradeDialog 
        open={isNewTradeOpen} 
        onOpenChange={setIsNewTradeOpen} 
        onAddTrade={handleAddTrade}
      />
    </>
  );
}
