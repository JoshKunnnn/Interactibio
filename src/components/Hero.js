import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-custom">
      <div className="hero-main-content">
        <div className="hero-text-block">
          <h1 className="hero-main-heading">Test Your Best, Beat the Rest!</h1>
          <p className="hero-main-subheading">
            Fun and interactive worksheets in Biology built for today’s learners.
          </p>
        </div>
        <div className="hero-banner-image-block">
          <img src="/images/banner.png" alt="Biology Banner" className="hero-banner-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 