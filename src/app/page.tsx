'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Trade } from '@/lib/types';
import { ArrowDownRight, ArrowUpRight, Bot } from 'lucide-react';
import PortfolioChart from '@/components/portfolio-chart';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { useTrades } from '@/context/trades-context';

function calculateStats(trades: Trade[]) {
  const closedTrades = trades.filter((t) => t.pnl !== null) as (Trade & {pnl: number})[];
  const totalPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = closedTrades.filter((t) => t.pnl > 0).length;
  const winRate =
    closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;
  const avgProfit =
    winningTrades > 0
      ? closedTrades
          .filter((t) => t.pnl > 0)
          .reduce((sum, t) => sum + t.pnl, 0) / winningTrades
      : 0;
  const avgLoss =
    closedTrades.length - winningTrades > 0
      ? closedTrades
          .filter((t) => t.pnl <= 0)
          .reduce((sum, t) => sum + t.pnl, 0) /
        (closedTrades.length - winningTrades)
      : 0;

  return { totalPnl, winRate, avgProfit, avgLoss };
}

function StatsCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change?: string;
}) {
  const isPositive = change && change.startsWith('+');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-headline">{value}</div>
        {change && (
          <p
            className={`text-xs mt-1 flex items-center ${
              isPositive ? 'text-chart-2' : 'text-chart-5'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {change} по сравнению с прошлым месяцем
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { trades } = useTrades();
  const stats = calculateStats(trades);
  const recentTrades = trades.slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in-0">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="font-headline">Эффективность портфеля</CardTitle>
          <CardDescription>
            Ваши торговые показатели за последние 30 дней.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioChart />
        </CardContent>
      </Card>

      <StatsCard
        title="Общий P/L"
        value={`$${stats.totalPnl.toFixed(2)}`}
        change="+12.5%"
      />
      <StatsCard
        title="Процент побед"
        value={`${stats.winRate.toFixed(1)}%`}
        change="-1.2%"
      />
      <StatsCard
        title="Сред. прибыль / убыток"
        value={`$${stats.avgProfit.toFixed(2)} / $${Math.abs(stats.avgLoss).toFixed(2)}`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bot className="text-primary" />
            AI Аналитика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Анализ ИИ выявил повторяющийся паттерн "бычий вымпел" в ваших выигрышных сделках по NVDA. Рассмотрите возможность поиска этой формации.
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="font-headline">Последние сделки</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Инструмент</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead className="text-right">P/L</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">
                    <Link href="#" className="hover:underline">
                      {trade.instrument}
                    </Link>
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
                  <TableCell
                    className={`text-right font-mono ${
                      trade.pnl !== null && trade.pnl > 0
                        ? 'text-chart-2'
                        : trade.pnl !== null && trade.pnl < 0
                        ? 'text-chart-5'
                        : ''
                    }`}
                  >
                    {trade.pnl !== null
                      ? `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(trade.entryDate), 'd MMM, yyyy', { locale: ru })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
