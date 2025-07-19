import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Teachers from '../components/Teachers';
import Learners from '../components/Learners';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <AboutUs />
      <Teachers />
      <Learners />
    </div>
  );
};

export default LandingPage; 