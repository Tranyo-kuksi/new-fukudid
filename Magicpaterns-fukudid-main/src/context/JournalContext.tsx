import React, { createContext, useContext, useState, useEffect } from 'react';

interface Song {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
  spotifyUrl: string;
}

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  date: Date;
  mood: number;
  images?: string[]; // Base64 encoded image data
  music?: string[];
  songs?: Song[];
}

interface MoodData {
  [key: string]: number;
}

interface JournalContextType {
  entries: JournalEntry[];
  moodData: MoodData;
  streak: number;
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
      
      // Sort entries by date in descending order
      const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
      
      // If no entries, streak is 0
      if (sortedEntries.length === 0) {
        setStreak(0);
        return;
      }

      // Get the most recent entry date
      const mostRecentEntry = sortedEntries[0];
      const mostRecentDate = new Date(mostRecentEntry.date);
      mostRecentDate.setHours(0, 0, 0, 0);

      // If the most recent entry is not today or yesterday, streak is 0
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (mostRecentDate.getTime() !== today.getTime() && 
          mostRecentDate.getTime() !== yesterday.getTime()) {
        setStreak(0);
        return;
      }

      // Calculate streak
      let currentStreak = 1;
      let currentDate = new Date(mostRecentDate);
      
      for (let i = 1; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date);
        entryDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
        
        if (entryDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
          currentDate = new Date(entryDate);
        } else {
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
    <JournalContext.Provider value={{ entries, moodData, streak, addEntry, updateEntry, deleteEntry }}>
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