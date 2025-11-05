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
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from 'lucide-react';
import { ChangeEvent, useRef, useEffect } from 'react';

const noteSchema = z.object({
  title: z.string().min(1, 'Тема обязательна').max(100, 'Тема не должна превышать 100 символов'),
  description: z.string().min(1, 'Описание обязательно'),
  screenshotUrl: z.string().optional(),
});

type NewNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOrUpdateNote: (note: Note) => void;
  noteToEdit?: Note | null;
};

export function NewNoteDialog({
  open,
  onOpenChange,
  onAddOrUpdateNote,
  noteToEdit,
}: NewNoteDialogProps) {
  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      description: '',
      screenshotUrl: '',
    },
  });

  useEffect(() => {
    if (noteToEdit && open) {
      form.reset({
        title: noteToEdit.title,
        description: noteToEdit.description,
        screenshotUrl: noteToEdit.screenshotUrl || '',
      });
    } else if (!open) {
      form.reset({
        title: '',
        description: '',
        screenshotUrl: '',
      });
    }
  }, [noteToEdit, open, form]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('screenshotUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof noteSchema>) {
    const noteData: Note = {
      id: noteToEdit ? noteToEdit.id : uuidv4(),
      title: values.title,
      description: values.description,
      screenshotUrl: values.screenshotUrl || null,
      createdAt: noteToEdit ? noteToEdit.createdAt : new Date().toISOString(),
    };
    onAddOrUpdateNote(noteData);
    onOpenChange(false);
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Редактировать заметку' : 'Создать новую заметку'}</DialogTitle>
          <DialogDescription>
            {noteToEdit ? 'Отредактируйте детали вашей заметки.' : 'Запишите свои мысли, наблюдения или анализ рынка.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема</FormLabel>
                  <FormControl>
                    <Input placeholder="напр. Анализ паттерна 'Голова и плечи'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Подробное описание ваших наблюдений..."
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="screenshotUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Скриншот (опционально)</FormLabel>
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
                           <img src={field.value} alt="Предпросмотр скриншота" className="max-h-20 rounded-md" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Отмена</Button>
              <Button type="submit">{noteToEdit ? 'Сохранить изменения' : 'Сохранить заметку'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
