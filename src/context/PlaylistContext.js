import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);

  // Load playlists for current user
  useEffect(() => {
    if (user) {
      const allPlaylists = getStorageItem('playlists', []);
      let userPlaylists = allPlaylists.filter(p => p.userId === user.id);
      
      // Ensure 'Liked Songs' playlist exists
      if (!userPlaylists.find(p => p.id === 'liked')) {
        const likedPlaylist = {
          id: 'liked',
          userId: user.id,
          name: 'Liked Songs',
          songs: []
        };
        userPlaylists = [likedPlaylist, ...userPlaylists];
        
        // Save back to storage
        const otherUsersPlaylists = allPlaylists.filter(p => p.userId !== user.id);
        setStorageItem('playlists', [...otherUsersPlaylists, ...userPlaylists]);
      }

      setPlaylists(userPlaylists);
    } else {
      setPlaylists([]);
    }
  }, [user]);

  // Save changes to localStorage
  const savePlaylists = (newPlaylists) => {
    if (!user) return;
    setPlaylists(newPlaylists);
    
    const allPlaylists = getStorageItem('playlists', []);
    const otherUsersPlaylists = allPlaylists.filter(p => p.userId !== user.id);
    setStorageItem('playlists', [...otherUsersPlaylists, ...newPlaylists]);
  };

  const createPlaylist = (name) => {
    if (!name.trim()) {
      toast.error('Playlist name cannot be empty');
      return false;
    }
    const newPlaylist = {
      id: Date.now().toString(),
      userId: user.id,
      name: name.trim(),
      songs: []
    };
    savePlaylists([...playlists, newPlaylist]);
    toast.success('Playlist created');
    return true;
  };

  const deletePlaylist = (playlistId) => {
    savePlaylists(playlists.filter(p => p.id !== playlistId));
    toast.success('Playlist deleted');
  };

  const addSongToPlaylist = (playlistId, song) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    if (playlist.songs.find(s => s.id === song.id)) {
      toast.info('Song already in playlist');
      return;
    }
    
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: [...p.songs, song] };
      }
      return p;
    });
    
    savePlaylists(updatedPlaylists);
    toast.success('Added to playlist');
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    });
    
    savePlaylists(updatedPlaylists);
    toast.success('Removed from playlist');
  };

  return (
    <PlaylistContext.Provider value={{
      playlists,
      createPlaylist,
      deletePlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};
