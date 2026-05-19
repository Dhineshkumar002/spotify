import React from 'react';
import { songsData } from '../data/songs';
import SongCard from '../components/SongCard';

const Home = () => {
  // Let's divide songs into categories just for display
  const tamilHits = songsData.slice(songsData.length - 12, songsData.length);
  const trendingNow = songsData.slice(songsData.length - 24, songsData.length - 12);
  const newlyAdded = songsData.slice(songsData.length - 36, songsData.length - 24);

  return (
    <div className="home-page">
      <section className="song-section">
        <div className="section-header">
          <h2>Tamil Hits</h2>
          <span>Show all</span>
        </div>
        <div className="song-grid">
          {tamilHits.map(song => (
            <SongCard key={song.id} song={song} queue={tamilHits} />
          ))}
        </div>
      </section>

      <section className="song-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <span>Show all</span>
        </div>
        <div className="song-grid">
          {trendingNow.map(song => (
            <SongCard key={song.id} song={song} queue={trendingNow} />
          ))}
        </div>
      </section>

      <section className="song-section">
        <div className="section-header">
          <h2>Newly Added</h2>
          <span>Show all</span>
        </div>
        <div className="song-grid">
          {newlyAdded.map(song => (
            <SongCard key={song.id} song={song} queue={newlyAdded} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
