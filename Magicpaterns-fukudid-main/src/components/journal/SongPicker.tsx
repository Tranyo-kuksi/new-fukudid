import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';

interface Song {
  id: string;
  name: string;
  artist: string;
  albumArt: string;
  previewUrl?: string;
  spotifyUrl: string;
}

interface SongPickerProps {
  onSongSelect: (song: Song) => void;
  onClose: () => void;
}

export function SongPicker({ onSongSelect, onClose }: SongPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // TODO: Replace with actual Spotify API call
  const searchSongs = async (searchQuery: string) => {
    setIsSearching(true);
    // Mock data for now
    const mockResults: Song[] = [
      {
        id: '1',
        name: 'Mock Song 1',
        artist: 'Artist 1',
        albumArt: 'https://via.placeholder.com/64',
        spotifyUrl: 'https://open.spotify.com'
      },
      {
        id: '2',
        name: 'Mock Song 2',
        artist: 'Artist 2',
        albumArt: 'https://via.placeholder.com/64',
        spotifyUrl: 'https://open.spotify.com'
      }
    ];
    setResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchSongs(query);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <FaSpotify className="w-6 h-6 text-green-500 mr-2" />
            Add a Song
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a song..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-4 text-gray-500">
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((song) => (
                <button
                  key={song.id}
                  onClick={() => onSongSelect(song)}
                  className="w-full p-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <img
                    src={song.albumArt}
                    alt={`${song.name} album art`}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {song.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {song.artist}
                    </div>
                  </div>
                </button>
              ))
            ) : query ? (
              <div className="text-center py-4 text-gray-500">
                No songs found
              </div>
            ) : null}
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 text-center text-sm text-gray-500">
          Powered by Spotify
        </div>
      </div>
    </div>
  );
} 