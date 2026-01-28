import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Features from './components/Features';
import Gallery from './components/Gallery';
import LocationAssistant from './components/LocationAssistant';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root font-body">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <Countdown />
        <Features />
        <Gallery />
        <LocationAssistant />
      </main>
      <Footer />
    </div>
  );
}

export default App;