"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { ru } from 'date-fns/locale';

const chartData = [
  { date: '2024-04-25', value: 10000 },
  { date: '2024-04-28', value: 10250 },
  { date: '2024-05-01', value: 10150 },
  { date: '2024-05-04', value: 10400 },
  { date: '2024-05-07', value: 10300 },
  { date: '2024-05-10', value: 10800 },
  { date: '2024-05-13', value: 10750 },
  { date: '2024-05-16', value: 11200 },
  { date: '2024-05-19', value: 11100 },
  { date: '2024-05-22', value: 11500 },
  { date: '2024-05-25', value: 11450 },
];

const chartConfig = {
  value: {
    label: 'Стоимость портфеля',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function PortfolioChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: '3 3' }}
              content={<ChartTooltipContent 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  labelClassName="font-bold"
                  indicator="dot"
                  className="bg-popover/80 backdrop-blur-sm"
              />}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
