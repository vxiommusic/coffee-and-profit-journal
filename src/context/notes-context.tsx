'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Note } from '@/lib/types';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (noteId: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Этот useEffect выполняется один раз на клиенте для загрузки данных
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error reading notes from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []); // Пустой массив зависимостей гарантирует, что это выполнится только один раз

  // Этот useEffect сохраняет данные в localStorage при их изменении
  useEffect(() => {
    // Мы сохраняем данные только после того, как они были инициализированы
    if (isInitialized) {
      try {
        localStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes to localStorage', error);
      }
    }
  }, [notes, isInitialized]); // Зависимость от 'notes' и 'isInitialized'

  const addNote = (note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };


  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
