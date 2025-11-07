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

// Функция для ленивой инициализации состояния из localStorage
const getInitialNotes = (): Note[] => {
  // Этот код выполнится только на клиенте
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  } catch (error) {
    console.error('Error reading notes from localStorage', error);
    return [];
  }
};


export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(getInitialNotes);

  // Этот useEffect сохраняет данные в localStorage при их изменении
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage', error);
    }
  }, [notes]);

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
