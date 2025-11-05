"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { Trade } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
  pnl: {
    label: 'Ежедневный P&L',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

function processTradeData(trades: Trade[]) {
  const dailyPnl: { [key: string]: number } = {};

  trades.forEach(trade => {
    if (trade.pnl !== null && trade.exitDate) {
      const date = format(new Date(trade.exitDate), 'yyyy-MM-dd');
      if (!dailyPnl[date]) {
        dailyPnl[date] = 0;
      }
      dailyPnl[date] += trade.pnl;
    }
  });

  return Object.keys(dailyPnl)
    .map(date => ({
      date,
      pnl: dailyPnl[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function PortfolioChart({ trades }: { trades: Trade[] }) {
  const chartData = processTradeData(trades);

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--accent))', radius: 4 }}
              content={<ChartTooltipContent 
                  formatter={(value, name, item) => (
                    <div className="flex flex-col">
                       <span className={`font-bold ${item.payload.pnl > 0 ? 'text-chart-2' : 'text-chart-5'}`}>
                         {`$${Number(value).toLocaleString()}`}
                       </span>
                    </div>
                  )}
                  labelClassName="font-bold"
                  indicator="dot"
                  className="bg-popover/80 backdrop-blur-sm"
              />}
            />
            <Bar dataKey="pnl" radius={4}>
              {chartData.map((entry, index) => (
                  <Bar 
                    key={`cell-${index}`} 
                    fill={entry.pnl > 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))'} 
                    />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
