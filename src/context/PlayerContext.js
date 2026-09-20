import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const audioRef = useRef(new Audio());

  // Play the next song
  const playNext = useCallback(() => {
    if (queue.length > 0 && queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;

      setQueueIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex]);

  // Handle audio ending
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [playNext]);

  // Load current song
  useEffect(() => {
    if (!currentSong) {
      return;
    }

    const audio = audioRef.current;

    audio.src = currentSong.url;
    audio.load();

    if (isPlaying) {
      audio
        .play()
        .catch((error) => {
          console.error("Playback error:", error);
        });
    }
  }, [currentSong, isPlaying]);

  // Handle play / pause
  useEffect(() => {
    const audio = audioRef.current;

    if (isPlaying && currentSong) {
      audio
        .play()
        .catch((error) => {
          console.error("Playback error:", error);
        });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Play a song
  const playSong = (song, newQueue = null) => {
    if (!song) {
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);

      const index = newQueue.findIndex(
        (item) => item.id === song.id
      );

      setQueueIndex(index !== -1 ? index : 0);
    }
  };

  // Toggle play / pause
  const togglePlay = () => {
    if (!currentSong) {
      return;
    }

    setIsPlaying((previousState) => !previousState);
  };

  // Play previous song
  const playPrev = () => {
    if (queue.length > 0 && queueIndex > 0) {
      const previousIndex = queueIndex - 1;

      setQueueIndex(previousIndex);
      setCurrentSong(queue[previousIndex]);
      setIsPlaying(true);
    }
  };

  // Pause current song
  const pauseSong = () => {
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        pauseSong,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};