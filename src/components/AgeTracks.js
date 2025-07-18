import React from 'react';
import './AgeTracks.css';

const AgeTracks = () => {
  const tracks = [
    {
      id: 1,
      icon: '🚀',
      ageRange: '(Age 4-6)',
      title: 'Curious Explorers',
      description: 'Playful discovery through patterns, sounds, and shapes',
      backgroundColor: '#FFB3BA',
      iconColor: '#FF6B6B'
    },
    {
      id: 2,
      icon: '💡',
      ageRange: 'Ages 7-9',
      title: 'Brain Builders',
      description: 'Hands-on experiments, puzzles, and first math adventures',
      backgroundColor: '#AED6F1',
      iconColor: '#3498DB'
    },
    {
      id: 3,
      icon: '⚛️',
      ageRange: 'Ages 10-12',
      title: 'Junior Analysts',
      description: 'Tackle real-world problems with science and logic',
      backgroundColor: '#D5A6BD',
      iconColor: '#8E44AD'
    }
  ];

  return (
    <section className="age-tracks section">
      <div className="container">
        <h2 className="section-title" style={{ color: '#8E44AD' }}>
          Age-Based Learning Tracks
        </h2>
        <div className="tracks-grid">
          {tracks.map(track => (
            <div
              key={track.id}
              className="track-card"
              style={{ backgroundColor: track.backgroundColor }}
            >
              <div className="track-icon" style={{ color: track.iconColor }}>
                {track.icon}
              </div>
              <div className="track-age">{track.ageRange}</div>
              <h3 className="track-title">{track.title}</h3>
              <p className="track-description">{track.description}</p>
              <button className="btn-secondary">Explore</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgeTracks; 