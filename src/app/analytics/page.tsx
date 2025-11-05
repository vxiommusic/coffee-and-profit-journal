'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { NewNoteDialog } from '@/components/new-note-dialog';
import { useNotes } from '@/context/notes-context';
import type { Note } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
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

export default function AnalyticsPage() {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();

  const handleAddOrUpdateNote = (note: Note) => {
    if (noteToEdit) {
      updateNote(note);
      toast({ title: 'Заметка обновлена' });
    } else {
      addNote(note);
      toast({ title: 'Заметка создана' });
    }
    setNoteToEdit(null);
  };

  const openNewNoteDialog = () => {
    setNoteToEdit(null);
    setIsNoteDialogOpen(true);
  };

  const openEditNoteDialog = (note: Note) => {
    setNoteToEdit(note);
    setIsNoteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      toast({
        title: 'Заметка удалена',
        variant: 'destructive',
      });
      setNoteToDelete(null);
    }
  };


  return (
    <>
      <Card className="animate-in fade-in-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Аналитика и Заметки</CardTitle>
          <Button onClick={openNewNoteDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать заметку
          </Button>
        </CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {notes.map((note) => (
                <AccordionItem value={note.id} key={note.id}>
                  <AccordionTrigger>{note.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(note.createdAt), 'd MMMM yyyy, HH:mm', {
                            locale: ru,
                          })}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditNoteDialog(note)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setNoteToDelete(note)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Это действие не может быть отменено. Это навсегда удалит вашу заметку.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setNoteToDelete(null)}>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Удалить
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{note.description}</p>
                      {note.screenshotUrl && (
                        <div className="relative mt-2 max-w-lg">
                          <Image
                            src={note.screenshotUrl}
                            alt={`Скриншот для ${note.title}`}
                            width={800}
                            height={600}
                            className="rounded-md object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
              <h2 className="text-2xl font-bold tracking-tight">
                Заметок пока нет
              </h2>
              <p className="text-muted-foreground">
                Создайте свою первую заметку, чтобы начать анализ.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewNoteDialog
        open={isNoteDialogOpen}
        onOpenChange={setIsNoteDialogOpen}
        onAddOrUpdateNote={handleAddOrUpdateNote}
        noteToEdit={noteToEdit}
      />
    </>
  );
}
