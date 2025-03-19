import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [moodData, setMoodData] = useState<MoodData>({});
  const [streak, setStreak] = useState(0);

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(parsedEntries);
      
      // Update mood data
      const newMoodData: MoodData = {};
      parsedEntries.forEach((entry: JournalEntry) => {
        const dateKey = entry.date.toISOString().split('T')[0];
        newMoodData[dateKey] = entry.mood;
      });
      setMoodData(newMoodData);
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  // Calculate streak on mount and when entries change
  useEffect(() => {
    const calculateStreak = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentStreak = 0;
      let currentDate = new Date(today);
      
      // Sort entries by date in descending order
      const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      // Check if there's an entry for today
      const hasEntryToday = sortedEntries.some(
        entry => entry.date.getTime() === today.getTime()
      );
      
      if (!hasEntryToday) {
        // If no entry today, check if there was an entry yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const hasEntryYesterday = sortedEntries.some(
          entry => entry.date.getTime() === yesterday.getTime()
        );
        
        if (!hasEntryYesterday) {
          setStreak(0);
          return;
        }
      }
      
      // Calculate streak
      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(currentDate);
        expectedDate.setHours(0, 0, 0, 0);
        
        if (entryDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (
          entryDate.getTime() < expectedDate.getTime() &&
          currentDate.getTime() - entryDate.getTime() > 2 * 24 * 60 * 60 * 1000
        ) {
          break;
        }
      }
      
      setStreak(currentStreak);
    };

    calculateStreak();
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now(),
      date: new Date()
    };
    
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries, newEntry];
      
      // Update mood data
      const dateKey = newEntry.date.toISOString().split('T')[0];
      setMoodData(prev => ({
        ...prev,
        [dateKey]: newEntry.mood
      }));
      
      return updatedEntries;
    });
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