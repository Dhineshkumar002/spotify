import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { PlaylistProvider } from './context/PlaylistContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <PlaylistProvider>
        <PlayerProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Home />} />
                  <Route path="search" element={<Search />} />
                  <Route path="library" element={<Library />} />
                  <Route path="playlist/:id" element={<Playlist />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
          </Router>
        </PlayerProvider>
      </PlaylistProvider>
    </AuthProvider>
  );
}

export default App;
