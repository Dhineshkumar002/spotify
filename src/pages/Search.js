import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { songsData } from '../data/songs';
import SongCard from '../components/SongCard';

const Search = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = songsData.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) || 
        song.artist.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-page">
      {!query ? (
        <div className="browse-all">
          <h2>Browse all</h2>
          <div className="category-grid">
            <div className="category-card" style={{backgroundColor: '#E13300'}}><h3>Podcasts</h3></div>
            <div className="category-card" style={{backgroundColor: '#7358FF'}}><h3>Made For You</h3></div>
            <div className="category-card" style={{backgroundColor: '#1E3264'}}><h3>New Releases</h3></div>
            <div className="category-card" style={{backgroundColor: '#E8115B'}}><h3>Tamil</h3></div>
            <div className="category-card" style={{backgroundColor: '#148A08'}}><h3>Pop</h3></div>
            <div className="category-card" style={{backgroundColor: '#BC5900'}}><h3>Hip-Hop</h3></div>
          </div>
        </div>
      ) : (
        <div className="search-results">
          <h2>Search results for "{query}"</h2>
          {results.length > 0 ? (
            <div className="song-grid">
              {results.map(song => (
                <SongCard key={song.id} song={song} queue={results} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No results found for "{query}"</h3>
              <p>Please make sure your words are spelled correctly or use less or different keywords.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
