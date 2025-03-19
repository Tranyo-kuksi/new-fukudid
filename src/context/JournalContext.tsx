import React, { createContext, useContext, useState } from 'react';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  date: Date;
  mood: number;
  images?: string[];
  music?: string[];
  songs?: any[];
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateEntry: (id: number, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: number) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now(),
      date: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: number, updatedFields: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        return { ...entry, ...updatedFields };
      }
      return entry;
    }));
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </JournalContext.Provider>
  );
}

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}; 