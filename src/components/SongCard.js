import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';

const SongCard = ({ song, queue }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlaylist();

  const isCurrent = currentSong?.id === song.id;
  const likedPlaylist = playlists.find(p => p.id === 'liked');
  const isLiked = likedPlaylist?.songs.some(s => s.id === song.id);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (!likedPlaylist) return;
    if (isLiked) {
      removeSongFromPlaylist('liked', song.id);
    } else {
      addSongToPlaylist('liked', song);
    }
  };

  return (
    <div className={`song-card ${isCurrent ? 'active' : ''}`} onClick={handlePlay}>
      <div className="card-img-container">
        <img src={song.coverUrl} alt={song.title} />
        <button className="card-play-btn">
          {isCurrent && isPlaying ? <Pause fill="black" /> : <Play fill="black" className="play-icon-offset" />}
        </button>
      </div>
      <div className="card-info">
        <h4>{song.title}</h4>
        <p>{song.artist}</p>
        <button 
          className="like-btn" 
          onClick={handleToggleLike} 
          title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
          <Heart size={18} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "#b3b3b3"} />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
