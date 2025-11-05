'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Trade } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';

const tradeSchema = z.object({
  instrument: z.string().min(1, 'Инструмент обязателен'),
  type: z.enum(['Long', 'Short'], { required_error: 'Тип обязателен' }),
  entryPrice: z.coerce.number().positive('Цена входа должна быть положительной'),
  exitPrice: z.coerce.number().positive('Цена выхода должна быть положительной').optional().or(z.literal('')),
  size: z.coerce.number().positive('Размер должен быть положительным'),
  commission: z.coerce.number().min(0, 'Комиссия не может быть отрицательной').optional().or(z.literal('')),
  entryDate: z.string().min(1, 'Дата входа обязательна'),
  exitDate: z.string().optional(),
  notes: z.string().optional(),
  chartImageUrl: z.string().optional(),
});

type NewTradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrade: (trade: Trade) => void;
};

export function NewTradeDialog({
  open,
  onOpenChange,
  onAddTrade,
}: NewTradeDialogProps) {
  const form = useForm<z.infer<typeof tradeSchema>>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      instrument: '',
      type: undefined,
      entryPrice: undefined,
      exitPrice: undefined,
      size: undefined,
      commission: undefined,
      entryDate: new Date().toISOString().slice(0, 16),
      exitDate: '',
      notes: '',
      chartImageUrl: '',
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('chartImageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  function onSubmit(values: z.infer<typeof tradeSchema>) {
    const commission = values.commission ? Number(values.commission) : 0;
    let pnl: number | null = null;

    if (values.exitPrice && values.entryPrice) {
      pnl =
        (Number(values.exitPrice) - values.entryPrice) *
        values.size *
        (values.type === 'Long' ? 1 : -1) - commission;
    }


    const newTrade: Trade = {
      id: uuidv4(),
      instrument: values.instrument,
      type: values.type,
      entryPrice: values.entryPrice,
      exitPrice: values.exitPrice ? Number(values.exitPrice) : null,
      size: values.size,
      commission: commission,
      entryDate: new Date(values.entryDate).toISOString(),
      exitDate: values.exitDate ? new Date(values.exitDate).toISOString() : null,
      notes: values.notes,
      chartImageUrl: values.chartImageUrl || null,
      pnl: pnl,
    };
    onAddTrade(newTrade);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить новую сделку</DialogTitle>
          <DialogDescription>
            Заполните детали вашей последней сделки.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Инструмент</FormLabel>
                  <FormControl>
                    <Input placeholder="напр. NVDA, BTC/USD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип сделки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Long">Длинная</SelectItem>
                      <SelectItem value="Short">Короткая</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена входа</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена выхода</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Размер</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комиссия ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата входа</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата выхода</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chartImageUrl"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Скриншот графика</FormLabel>
                   <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Загрузить изображение
                      </Button>
                      {field.value && (
                        <div className="mt-2">
                           <img src={field.value} alt="Предпросмотр графика" className="max-h-20 rounded-md" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Заметки</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Добавьте заметки о вашей сделке..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
              <Button type="submit">Сохранить сделку</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
