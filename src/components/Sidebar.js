import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, Music } from 'lucide-react';
import { usePlaylist } from '../context/PlaylistContext';

const Sidebar = () => {
  const { playlists, createPlaylist } = usePlaylist();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (createPlaylist(newPlaylistName)) {
      setNewPlaylistName('');
      setShowCreateMenu(false);
    }
  };

  const userPlaylists = playlists.filter(p => p.id !== 'liked');

  return (
    <div className="sidebar">
      <div className="logo" onClick={() => navigate('/')}>
        <Music size={32} color="#1db954" />
        <h2>Spotify</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <Home size={24} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
              <Search size={24} />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/library" className={({ isActive }) => isActive ? 'active' : ''}>
              <Library size={24} />
              <span>Your Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/playlist/liked" className={({ isActive }) => isActive ? 'active' : ''}>
              <Heart size={24} />
              <span>Liked Songs</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-actions">
        <button className="action-btn" onClick={() => setShowCreateMenu(!showCreateMenu)}>
          <div className="icon-container"><PlusSquare size={24} /></div>
          <span>Create Playlist</span>
        </button>
        
        {showCreateMenu && (
          <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="save-btn">Save</button>
          </form>
        )}
      </div>

      <div className="sidebar-playlists">
        <ul>
          {userPlaylists.map(playlist => (
            <li key={playlist.id}>
              <NavLink to={`/playlist/${playlist.id}`} className={({ isActive }) => isActive ? 'active' : ''}>
                {playlist.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
