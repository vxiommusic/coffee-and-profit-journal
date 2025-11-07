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
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Этот хук выполнится один раз на клиенте для безопасной загрузки данных
  useEffect(() => {
    setNotes(getInitialNotes());
  }, []);

  // Этот хук сохраняет данные при любом их изменении
  useEffect(() => {
    // Проверяем, что это не начальное состояние, чтобы избежать затирания данных
    // при серверном рендеринге или до гидратации.
    // Мы можем сохранить пустой массив, если пользователь удалил все заметки.
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('notes', JSON.stringify(notes));
        } catch (error) {
            console.error('Error saving notes to localStorage', error);
        }
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
    const newNotes = notes.filter((note) => note.id !== noteId);
    setNotes(newNotes);
    // Принудительно сохраняем, даже если массив стал пустым
     try {
        localStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (error) {
        console.error('Error saving notes to localStorage after deletion', error);
    }
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
