import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Trash2, Clock, MoreHorizontal, Heart } from 'lucide-react';
import { songsData } from '../data/songs';

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, deletePlaylist, removeSongFromPlaylist, addSongToPlaylist } = usePlaylist();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const foundPlaylist = playlists.find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
    } else {
      navigate('/');
    }
  }, [id, playlists, navigate]);

  if (!playlist) return null;

  const handleDelete = () => {
    deletePlaylist(id);
    navigate('/');
  };

  const handlePlayPlaylist = () => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const likedPlaylist = playlists.find(p => p.id === 'liked');

  const handleToggleLike = (e, song) => {
    e.stopPropagation();
    if (!likedPlaylist) return;
    const isLiked = likedPlaylist.songs.some(s => s.id === song.id);
    if (isLiked) {
      removeSongFromPlaylist('liked', song.id);
    } else {
      addSongToPlaylist('liked', song);
    }
  };

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-cover-large">
          {playlist.songs.length > 0 ? (
            <img src={playlist.songs[0].coverUrl} alt="cover" />
          ) : (
            <div className="empty-cover">🎵</div>
          )}
        </div>
        <div className="playlist-info">
          <span>Playlist</span>
          <h1>{playlist.name}</h1>
          <p>{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className="playlist-actions">
        <button 
          className="play-btn-large" 
          onClick={handlePlayPlaylist}
          disabled={playlist.songs.length === 0}
        >
          <Play size={28} fill="black" className="play-icon-offset" />
        </button>
        <button className="icon-btn" onClick={() => setShowAddMenu(!showAddMenu)} title="Add songs">
          <MoreHorizontal size={32} />
        </button>
        {playlist.id !== 'liked' && (
          <button className="icon-btn" onClick={handleDelete} title="Delete Playlist">
            <Trash2 size={24} />
          </button>
        )}
      </div>

      {showAddMenu && (
        <div className="add-songs-container">
          <h3>Add songs to {playlist.name}</h3>
          <div className="add-songs-list">
            {songsData.slice(0, 10).map(song => (
              <div key={song.id} className="add-song-row">
                <img src={song.coverUrl} alt="cover" />
                <div className="song-details">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                </div>
                <button onClick={() => addSongToPlaylist(playlist.id, song)}>Add</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="songs-list-container">
        <div className="songs-list-header">
          <div>#</div>
          <div>Title</div>
          <div className="clock-icon"><Clock size={16} /></div>
        </div>

        <div className="songs-list">
          {playlist.songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedPlaylist?.songs.some(s => s.id === song.id);
            
            return (
              <div 
                key={song.id} 
                className={`song-row ${isCurrent ? 'active' : ''}`}
                onClick={() => playSong(song, playlist.songs)}
              >
                <div className="song-number">
                  {isCurrent && isPlaying ? (
                    <Pause size={16} fill="#1db954" color="#1db954" onClick={(e) => { e.stopPropagation(); togglePlay(); }} />
                  ) : (
                    <span className="number">{index + 1}</span>
                  )}
                  <Play size={16} fill="white" className="play-hover" />
                </div>
                <div className="song-title-col">
                  <img src={song.coverUrl} alt="cover" />
                  <div className="song-details">
                    <h4 style={{ color: isCurrent ? '#1db954' : 'white' }}>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                </div>
                <div className="song-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    className="icon-btn" 
                    onClick={(e) => handleToggleLike(e, song)}
                    title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Heart size={18} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "#b3b3b3"} />
                  </button>
                  <button 
                    className="remove-btn" 
                    onClick={(e) => { e.stopPropagation(); removeSongFromPlaylist(playlist.id, song.id); }}
                    title="Remove from playlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {playlist.songs.length === 0 && (
            <div className="empty-playlist">
              <p>This playlist is currently empty.</p>
              <button onClick={() => setShowAddMenu(true)}>Find songs to add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
