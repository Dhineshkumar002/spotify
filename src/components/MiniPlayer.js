import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrev, audioRef } = usePlayer();
  const { playlists, addSongToPlaylist, removeSongFromPlaylist } = usePlaylist();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
        setDuration(formatTime(audio.duration));
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio.duration) {
      const newTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  if (!currentSong) return null;

  const likedPlaylist = playlists.find(p => p.id === 'liked');
  const isLiked = likedPlaylist?.songs.some(s => s.id === currentSong.id);

  const toggleLike = () => {
    if (!likedPlaylist) return;
    if (isLiked) {
      removeSongFromPlaylist('liked', currentSong.id);
    } else {
      addSongToPlaylist('liked', currentSong);
    }
  };

  return (
    <div className="mini-player">
      <div className="player-left">
        <img src={currentSong.coverUrl} alt="cover" className="player-cover" />
        <div className="player-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>
        <button className="like-btn" onClick={toggleLike} style={{ marginLeft: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Heart size={20} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "#b3b3b3"} />
        </button>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn" onClick={playPrev}><SkipBack size={20} /></button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="play-icon-offset" />}
          </button>
          <button className="control-btn" onClick={playNext}><SkipForward size={20} /></button>
        </div>
        <div className="playback-bar">
          <span className="time">{currentTime}</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={handleSeek}
            className="progress-bar"
          />
          <span className="time">{duration}</span>
        </div>
      </div>

      <div className="player-right">
        <Volume2 size={20} />
        <input type="range" className="volume-bar" min="0" max="1" step="0.01" onChange={(e) => {
          if (audioRef.current) audioRef.current.volume = e.target.value;
        }} defaultValue="1" />
      </div>
    </div>
  );
};

export default MiniPlayer;
