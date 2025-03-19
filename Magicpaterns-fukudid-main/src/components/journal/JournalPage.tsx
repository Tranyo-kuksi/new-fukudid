import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiImage, FiMusic, FiSend, FiX, FiEdit2 } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { useJournal } from '../../context/JournalContext';
import { 
  FaSkull, 
  FaSadTear, 
  FaMeh, 
  FaSmile, 
  FaGrinStars 
} from 'react-icons/fa';
import { SongPicker } from './SongPicker';
import { ImageViewer } from './ImageViewer';
import { debounce } from 'lodash';

console.log('JournalPage component loading');

interface MoodOption {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    icon: <FaGrinStars className="w-8 h-8" />,
    label: 'Fckin Awesome',
    color: 'bg-yellow-400 hover:bg-yellow-500 text-black'
  },
  {
    icon: <FaSmile className="w-8 h-8" />,
    label: 'Pretty GOOD',
    color: 'bg-green-400 hover:bg-green-500 text-black'
  },
  {
    icon: <FaMeh className="w-8 h-8" />,
    label: 'MEH',
    color: 'bg-blue-400 hover:bg-blue-500 text-black'
  },
  {
    icon: <FaSadTear className="w-8 h-8" />,
    label: 'Shity',
    color: 'bg-orange-400 hover:bg-orange-500 text-black'
  },
  {
    icon: <FaSkull className="w-8 h-8" />,
    label: 'Dead Inside',
    color: 'bg-red-400 hover:bg-red-500 text-black'
  }
];

const PROMPTS = [
  "What made you laugh so hard you almost peed today?",
  "What's the weirdest thing you saw someone do today?",
  "If your life was a sitcom, what would today's episode be called?",
  "What's the most ridiculous thing you believed as a kid?",
  "What's your spirit animal today and why?",
  "If you could swap lives with your pet for a day, what would you do?",
  "What's the most random thought that popped into your head today?",
  "What's your current mood in emoji form?",
  "What's the weirdest dream you remember having?",
  "If you were a superhero, what would your power be and why?",
  "What's the most embarrassing thing you did this week?",
  "What's your current mood in GIF form?",
  "If you could have any animal as a roommate, what would it be?",
  "What's the most ridiculous excuse you've ever made?",
  "What's your spirit food today and why?",
  "If your life was a meme, what would it be?",
  "What's the weirdest thing you've ever googled?",
  "What's your current mood in song form?",
  "If you could have any superpower, what would it be and why?",
  "What's the most random thing you've ever said?",
  "What's your spirit color today and why?",
  "If you were a character in a video game, what would your stats be?",
  "What's the most ridiculous thing you've ever believed?",
  "What's your current mood in movie form?",
  "If you could have any animal as a sidekick, what would it be?",
  "What's the weirdest thing you've ever done in public?",
  "What's your spirit number today and why?",
  "If you were a meme, what would you be?",
  "What's the most random thing you've ever thought?",
  "What's your current mood in TV show form?",
  "If you could have any mythical creature as a pet, what would it be?",
  "What's the most ridiculous thing you've ever said?",
  "What's your spirit element today and why?",
  "If you were a character in a book, what would your role be?",
  "What's the weirdest thing you've ever seen?",
  "What's your current mood in weather form?",
  "If you could have any superpower, what would it be and why?",
  "What's the most random thing you've ever done?",
  "What's your spirit season today and why?",
  "If you were a character in a movie, what would your role be?",
  "What's the most ridiculous thing you've ever believed?",
  "What's your current mood in food form?",
  "If you could have any animal as a best friend, what would it be?",
  "What's the weirdest thing you've ever heard?",
  "What's your spirit time of day today and why?",
  "If you were a character in a TV show, what would your role be?",
  "What's the most random thing you've ever seen?",
  "What's your current mood in color form?",
  "If you could have any mythical creature as a sidekick, what would it be?"
];

interface Song {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
  spotifyUrl: string;
}

interface ImageFile {
  name: string;
  url: string;
}

interface JournalPageProps {
  editingEntry?: {
    id: number;
    title: string;
    content: string;
    mood: number;
    images?: string[];
    music?: string[];
    songs?: Song[];
  } | null;
  onEditComplete?: () => void;
}

const DRAFT_STORAGE_KEY = 'journal_draft';
const AUTOSAVE_DELAY = 1000; // 1 second

interface JournalDraft {
  title: string;
  content: string;
  selectedMood: number | null;
  images: ImageFile[];
  songs: Song[];
  lastModified: number;
}

export function JournalPage({ editingEntry = null, onEditComplete }: JournalPageProps) {
  const { addEntry, updateEntry, entries } = useJournal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [todayEntry, setTodayEntry] = useState<typeof editingEntry>(null);

  // Autosave function
  const saveToLocalStorage = useCallback(() => {
    const draft: JournalDraft = {
      title,
      content,
      selectedMood,
      images,
      songs,
      lastModified: Date.now()
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setIsDraft(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [title, content, selectedMood, images, songs]);

  // Separate function for updating journal context
  const updateJournal = useCallback(() => {
    if (title.trim() && content.trim() && selectedMood !== null) {
      const entryData = {
        title,
        content,
        mood: selectedMood,
        images: images.map(image => image.url),
        music,
        songs
      };

      if (todayEntry) {
        updateEntry(todayEntry.id, entryData);
      } else {
        addEntry(entryData);
      }
    }
  }, [title, content, selectedMood, images, songs, music, todayEntry, addEntry, updateEntry]);

  // Debounced autosave
  const debouncedSave = useMemo(
    () => debounce(saveToLocalStorage, AUTOSAVE_DELAY),
    [saveToLocalStorage]
  );

  // Debounced journal update
  const debouncedJournalUpdate = useMemo(
    () => debounce(updateJournal, AUTOSAVE_DELAY * 2), // Double the delay for journal updates
    [updateJournal]
  );

  // Save when content changes
  useEffect(() => {
    if (title || content || selectedMood !== null || images.length > 0 || songs.length > 0) {
      debouncedSave();
      debouncedJournalUpdate();
    }
    
    return () => {
      debouncedSave.cancel();
      debouncedJournalUpdate.cancel();
    };
  }, [title, content, selectedMood, images, songs, debouncedSave, debouncedJournalUpdate]);

  // Load draft or today's entry on mount
  useEffect(() => {
    const today = new Date();
    const entry = entries.find(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === today.getFullYear() &&
             entryDate.getMonth() === today.getMonth() &&
             entryDate.getDate() === today.getDate();
    });

    if (entry) {
      setTodayEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedMood(entry.mood);
      setImages(entry.images?.map(image => ({
        name: 'image',
        url: image
      })) || []);
      setSongs(entry.songs || []);
    } else {
      // Check for existing draft if no entry exists
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft: JournalDraft = JSON.parse(savedDraft);
        const now = Date.now();
        const hoursSinceModified = (now - draft.lastModified) / (1000 * 60 * 60);
        
        // Only restore draft if it's less than 24 hours old
        if (hoursSinceModified < 24) {
          setTitle(draft.title);
          setContent(draft.content);
          setSelectedMood(draft.selectedMood);
          setImages(draft.images);
          setSongs(draft.songs);
          setIsDraft(true);
        } else {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
    }
  }, [entries]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
      saveToLocalStorage();
    };
  }, [debouncedSave, saveToLocalStorage]);

  // Save when user switches tabs or closes window
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        debouncedSave.cancel();
        saveToLocalStorage();
      }
    };

    const handleBeforeUnload = () => {
      debouncedSave.cancel();
      saveToLocalStorage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [debouncedSave, saveToLocalStorage]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please add a title for your entry!');
      return;
    }
    if (!content.trim() || selectedMood === null) {
      alert('Please write something and select a mood before saving!');
      return;
    }

    // Cancel any pending debounced saves
    debouncedSave.cancel();
    debouncedJournalUpdate.cancel();

    // Save immediately
    saveToLocalStorage();
    updateJournal();

    // Clear draft state
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsDraft(false);
  };

  const generatePrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setContent(prevContent => {
      const promptWithNewlines = prevContent ? `${prevContent}\n\n✨ ${randomPrompt}\n` : `✨ ${randomPrompt}\n`;
      return promptWithNewlines;
    });
  };

  const handleImageAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newImages = await Promise.all(
          Array.from(files).map(async file => {
            // Convert file to base64
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            
            return {
          name: file.name,
              url: base64 // Store the base64 string directly
            };
          })
        );
        setImages(prev => [...prev, ...newImages]);
      }
    };
    input.click();
  };

  const handleMusicAttachment = () => {
    setShowSongPicker(true);
  };

  const handleSongSelect = (song: Song) => {
    setSongs(prev => [...prev, song]);
    setShowSongPicker(false);
  };

  const removeSong = (songId: string) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
  };

  const removeImage = (imageUrl: string) => {
    setImages(prev => prev.filter(img => img.url !== imageUrl));
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowMoodPicker(!showMoodPicker)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                selectedMood !== null 
                  ? `${moodOptions[selectedMood].color} text-black`
                  : 'bg-white dark:bg-gray-700 text-gray-500'
              }`}
            >
              {selectedMood !== null ? (
                <span className="flex items-center space-x-2">
                  {moodOptions[selectedMood].icon}
                  <span className="ml-2">{moodOptions[selectedMood].label}</span>
                </span>
              ) : (
                <span>Select Mood</span>
              )}
            </button>
            
            {showMoodPicker && (
              <div className="absolute top-full left-0 mt-2 bg-gray-900 rounded-2xl shadow-lg p-3 z-10 w-64">
                <div className="flex flex-col space-y-2">
                  {moodOptions.map((mood, index) => (
                    <button
                      key={mood.label}
                      onClick={() => {
                        setSelectedMood(index);
                        setShowMoodPicker(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${mood.color} w-full`}
                      title={mood.label}
                    >
                      <span>{mood.icon}</span>
                      <span className="font-medium text-lg">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleImageAttachment}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow text-gray-600 dark:text-gray-300"
          >
            <FiImage className="w-5 h-5" />
          </button>
          <button
            onClick={handleMusicAttachment}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow text-gray-600 dark:text-gray-300"
          >
            <FiMusic className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title..."
        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:shadow-md transition-shadow text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-medium"
      />

      {(images.length > 0 || songs.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div 
              key={`image-${index}`} 
              className="relative group cursor-pointer"
              onClick={() => setFullScreenImage(image.url)}
            >
              <img 
                src={image.url} 
                alt={image.name}
                className="w-24 h-24 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.url);
                }}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center space-x-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg"
            >
              <FaSpotify className="w-4 h-4" />
              <img
                src={song.albumArt}
                alt={`${song.name} album art`}
                className="w-8 h-8 rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{song.name}</div>
                <div className="text-sm opacity-75">{song.artist}</div>
              </div>
              <button
                onClick={() => removeSong(song.id)}
                className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="flex-1 w-full p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:shadow-md transition-shadow resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
      />

      <div className="flex justify-between">
        <button
          onClick={generatePrompt}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Generate Prompt
        </button>
        <div className="flex space-x-2">
        <button
          onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center space-x-2"
        >
            <span>Save</span>
          <FiSend className="w-4 h-4" />
        </button>
        </div>
      </div>

      {showSongPicker && (
        <SongPicker
          onSongSelect={handleSongSelect}
          onClose={() => setShowSongPicker(false)}
        />
      )}

      {fullScreenImage && (
        <ImageViewer
          imageUrl={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </div>
  );
} 