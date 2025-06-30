import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';

const HomePage = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default HomePage;