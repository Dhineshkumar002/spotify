import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { Music } from 'lucide-react';

const Library = () => {
  const { playlists } = usePlaylist();
  const navigate = useNavigate();

  const likedPlaylist = playlists.find(p => p.id === 'liked');
  const userPlaylists = playlists.filter(p => p.id !== 'liked');

  return (
    <div className="library-page">
      <h2>Your Library</h2>
      <div className="library-grid">
        <div className="library-card liked-songs" onClick={() => navigate('/playlist/liked')}>
          <div className="liked-content">
            <h3>Liked Songs</h3>
            <p>{likedPlaylist ? likedPlaylist.songs.length : 0} liked songs</p>
          </div>
        </div>
        
        {userPlaylists.map(playlist => (
          <div key={playlist.id} className="library-card playlist-card" onClick={() => navigate(`/playlist/${playlist.id}`)}>
            <div className="card-img-container">
              {playlist.songs.length > 0 ? (
                <img src={playlist.songs[0].coverUrl} alt="cover" />
              ) : (
                <div className="empty-cover"><Music size={48} /></div>
              )}
            </div>
            <div className="card-info">
              <h4>{playlist.name}</h4>
              <p>By You • {playlist.songs.length} songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
