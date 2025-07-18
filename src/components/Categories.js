import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 1,
      icon: '📐',
      title: 'Math',
      subtitle: 'Puzzles',
      color: '#FF9500'
    },
    {
      id: 2,
      icon: '🧩',
      title: 'Logic',
      subtitle: 'Games',
      color: '#007AFF'
    },
    {
      id: 3,
      icon: '🧪',
      title: 'Science',
      subtitle: 'Experiments',
      color: '#34C759'
    },
    {
      id: 4,
      icon: '📚',
      title: 'Problem',
      subtitle: 'Solving',
      color: '#FF3B30'
    }
  ];

  return (
    <section className="categories section" id="categories">
      <div className="container">
        <h2 className="section-title categories-title">
          Learning Categories
        </h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <div className="category-content">
                <h3 className="category-title" style={{ color: category.color }}>
                  {category.title}
                </h3>
                <p className="category-subtitle">{category.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 