'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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

export default function AnalyticsPage() {
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const { notes, addNote } = useNotes();

  const handleAddNote = (note: Note) => {
    addNote(note);
    // Optionally add a toast notification here
  };

  return (
    <>
      <Card className="animate-in fade-in-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Аналитика и Заметки</CardTitle>
          <Button onClick={() => setIsNewNoteOpen(true)}>
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
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(note.createdAt), 'd MMMM yyyy, HH:mm', {
                          locale: ru,
                        })}
                      </p>
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
        open={isNewNoteOpen}
        onOpenChange={setIsNewNoteOpen}
        onAddNote={handleAddNote}
      />
    </>
  );
}
