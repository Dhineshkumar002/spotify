import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <User size={64} />
        </div>
        <div className="profile-info">
          <span>Profile</span>
          <h1>{user.name}</h1>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-item">
          <Mail size={20} />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
