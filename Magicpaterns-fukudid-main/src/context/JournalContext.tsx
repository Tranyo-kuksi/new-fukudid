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

// Mock data for initial state
const mockEntries: JournalEntry[] = [
  {
    id: 1,
    title: "Amazing Project Success!",
    content: "Today was an amazing day! I finally finished my project and got great feedback from my team. Feeling really proud of myself.",
    date: new Date(2024, 2, 16),
    mood: 4,
    images: [],
    music: [],
    songs: []
  },
  {
    id: 2,
    title: "Keeping My Head Up",
    content: "Feeling a bit down today. Things didn't go as planned, but I'm trying to stay positive.",
    date: new Date(2024, 2, 15),
    mood: 1,
    images: [],
    music: [],
    songs: []
  }
];

const mockMoodData: MoodData = {
  '2024-03-16': 4,
  '2024-03-15': 1,
  '2024-03-14': 2,
  '2024-03-13': 3,
  '2024-03-12': 0
};

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [moodData, setMoodData] = useState<MoodData>(mockMoodData);
  const [streak, setStreak] = useState(0);

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

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    // Convert image files to base64 strings
    const processedEntry = {
      ...entry,
      id: Date.now(),
      date: new Date(),
      images: entry.images ? await Promise.all(
        entry.images.map(async (imageName) => {
          try {
            const response = await fetch(imageName);
            const blob = await response.blob();
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error processing image:', error);
            return '';
          }
        })
      ) : []
    };

    setEntries(prev => [processedEntry, ...prev]);
    
    // Update mood data
    const dateKey = processedEntry.date.toISOString().split('T')[0];
    setMoodData(prev => ({
      ...prev,
      [dateKey]: processedEntry.mood
    }));
  };

  const updateEntry = async (id: number, updatedFields: Partial<JournalEntry>) => {
    // Process images if they're being updated
    const processedFields = { ...updatedFields };
    if (updatedFields.images) {
      processedFields.images = await Promise.all(
        updatedFields.images.map(async (imageName) => {
          try {
            const response = await fetch(imageName);
            const blob = await response.blob();
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error processing image:', error);
            return '';
          }
        })
      );
    }

    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, ...processedFields };
        
        // Update mood data if mood changed
        if (updatedFields.mood !== undefined) {
          const dateKey = entry.date.toISOString().split('T')[0];
          setMoodData(prev => ({
            ...prev,
            [dateKey]: updatedFields.mood!
          }));
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => {
      const entryToDelete = prev.find(entry => entry.id === id);
      if (entryToDelete) {
        const dateKey = entryToDelete.date.toISOString().split('T')[0];
        setMoodData(prevMoodData => {
          const newMoodData = { ...prevMoodData };
          delete newMoodData[dateKey];
          return newMoodData;
        });
      }
      return prev.filter(entry => entry.id !== id);
    });
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        moodData,
        streak,
        addEntry,
        updateEntry,
        deleteEntry
      }}
    >
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