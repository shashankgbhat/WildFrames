import React, { useState, useEffect } from 'react';
import photosData from '../data/photos.json';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredPhotos = photosData.photos.filter(photo => photo.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPhotos.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [featuredPhotos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPhotos.length) % featuredPhotos.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (featuredPhotos.length === 0) {
    // Fallback if no photos are loaded
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 hero-title">
            Wild<span className="text-green-600">Frames</span>
          </h1>
          <p className="text-xl md:text-2xl hero-subtitle mb-8">
            Capturing Nature's Wild Beauty
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-lg font-semibold btn-primary transition-colors">
              Explore Gallery
            </button>
            <button className="px-8 py-4 border-2 rounded-lg font-semibold btn-secondary transition-colors">
              Read Stories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {featuredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Capturing Nature's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Wild Beauty
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 leading-relaxed max-w-4xl mx-auto">
            Welcome to my photographic journey through India's incredible wildlife and landscapes. 
            Each frame tells a story of conservation, wonder, and the delicate balance of our natural world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Gallery
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
              Read Stories
            </button>
          </div>
          
          {/* Current photo info */}
          <div className="mt-12 text-center">
            <p className="text-lg font-medium mb-2">{featuredPhotos[currentSlide]?.title}</p>
            <p className="text-sm text-gray-300">{featuredPhotos[currentSlide]?.location}</p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next image"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {featuredPhotos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <div className="flex flex-col items-center text-white text-opacity-70">
          <span className="text-sm mb-3 writing-mode-vertical transform rotate-90 origin-center">SCROLL</span>
          <div className="w-px h-16 bg-white bg-opacity-50 relative">
            <div className="absolute bottom-0 w-px h-8 bg-white animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Photo credit */}
      <div className="absolute top-20 right-6 z-20 text-white text-opacity-60 text-sm hidden md:block">
        <p>{featuredPhotos[currentSlide]?.description}</p>
      </div>
    </section>
  );
};

export default Hero;