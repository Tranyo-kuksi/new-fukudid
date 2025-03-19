import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { useJournal } from '../../context/JournalContext';
import { JournalPage } from './JournalPage';
import { ImageViewer } from './ImageViewer';
import { 
  FaSkull, 
  FaSadTear, 
  FaMeh, 
  FaSmile, 
  FaGrinStars,
  FaSpotify,
  FaRegSmile as FiSmile
} from 'react-icons/fa';
import { format } from 'date-fns';

const moodIcons = [
  { icon: <FaGrinStars className="w-5 h-5" />, color: 'text-yellow-500', label: 'Fckin Awesome' },
  { icon: <FaSmile className="w-5 h-5" />, color: 'text-green-500', label: 'Pretty GOOD' },
  { icon: <FaMeh className="w-5 h-5" />, color: 'text-blue-500', label: 'MEH' },
  { icon: <FaSadTear className="w-5 h-5" />, color: 'text-orange-500', label: 'Shity' },
  { icon: <FaSkull className="w-5 h-5" />, color: 'text-red-500', label: 'Dead Inside' }
];

interface Song {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl: string;
  spotifyUrl: string;
}

export function JournalEntries() {
  const { entries, deleteEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.date.toLocaleDateString().includes(searchQuery)
  );

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      if (selectedEntry === id) {
        setSelectedEntry(null);
      }
      if (editingEntry === id) {
        setEditingEntry(null);
      }
    }
  };

  if (editingEntry) {
    const entry = entries.find(e => e.id === editingEntry);
    if (!entry) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Editing Entry from {entry.date.toLocaleDateString()}
          </h2>
          <button
            onClick={() => setEditingEntry(null)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <JournalPage
            editingEntry={entry}
            onEditComplete={() => setEditingEntry(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-pink-500 transition-colors dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEntry(entry.id)}
                  className="p-1 hover:text-pink-500 transition-colors"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={(e) => handleDelete(entry.id, e)}
                  className="p-1 hover:text-pink-500 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {entry.content}
            </p>

            {entry.images && entry.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {entry.images.slice(0, 3).map((_, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                  >
                    picture
                  </div>
                ))}
                {entry.images.length > 3 && (
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                    +{entry.images.length - 3} more
                  </div>
                )}
              </div>
            )}

            {entry.songs && entry.songs.length > 0 && (
              <div className="flex gap-2 mb-4">
                {entry.songs.slice(0, 2).map((song, index) => (
                  <a
                    key={index}
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <FaSpotify className="text-green-500" />
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{song.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {song.artist}
                      </div>
                    </div>
                  </a>
                ))}
                {entry.songs.length > 2 && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    +{entry.songs.length - 2} more
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar size={14} />
              <span>{format(entry.date, 'PPP')}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center gap-1">
                {moodIcons[entry.mood].icon}
                <span className={`${moodIcons[entry.mood].color}`}>
                  {moodIcons[entry.mood].label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fullScreenImage && (
        <ImageViewer
          imageUrl={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </div>
  );
}