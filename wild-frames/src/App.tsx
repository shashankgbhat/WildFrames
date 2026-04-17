import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import About from './components/About';
import FieldNotePage from './pages/FieldNotePage';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Hero />} />
        <Route path="/gallery"    element={<Gallery />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<FieldNotePage />} />
        <Route path="/about"      element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <div className="app-shell">
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </MotionConfig>
  );
}

export default App;
