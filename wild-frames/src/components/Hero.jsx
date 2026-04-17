import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import photosData from '../data/photos.json';

const featuredPhotos = photosData.photos.filter((photo) => photo.featured);
const reportPhotos = photosData.photos.slice(0, 4);

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!featuredPhotos.length) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPhotos.length);
    }, 5600);

    return () => window.clearInterval(intervalId);
  }, []);

  if (!featuredPhotos.length) {
    return (
      <section className="page-shell page-shell--tight">
        <div className="empty-state">
          <p className="section-kicker">WildFrames</p>
          <h1>No featured photographs are available yet.</h1>
          <p>Add entries to the photo collection to bring the homepage to life.</p>
        </div>
      </section>
    );
  }

  const currentPhoto = featuredPhotos[currentSlide];

  return (
    <div className="home-page">
      <section className="reference-hero">
        <div className="reference-hero__media">
          {featuredPhotos.map((photo, index) => (
            <figure
              key={photo.id}
              className={`reference-hero__frame ${index === currentSlide ? 'is-visible' : ''}`}
            >
              <img src={photo.imageUrl} alt={photo.title} className="reference-hero__image" />
            </figure>
          ))}
          <div className="reference-hero__overlay" />
        </div>

        <div className="page-shell reference-hero__content">
          <p className="section-kicker">Wildlife Photography Journal</p>
          <h1>Field encounters, wild spaces, and a darker natural atmosphere.</h1>
          <p className="reference-hero__copy">
            A portfolio of reptiles, birds, and natural history moments photographed across
            India with the calmer editorial mood of a trip report.
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="button button--primary">
              Gallery
            </Link>
            <Link to="/blog" className="button button--ghost">
              Stories
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell reference-intro">
        <div>
          <p className="section-kicker">Introduction</p>
          <h2>A wildlife portfolio shaped like a trip report instead of a typical gallery.</h2>
        </div>
        <div className="reference-intro__copy">
          <p>
            The layout now follows a more report-like rhythm: long horizontal images,
            measured text blocks, subdued borders, and a dark natural palette that lets the
            photographs lead.
          </p>
          <p>
            This gives you a strong base now, while still leaving room to add richer
            gallery features later.
          </p>
        </div>
      </section>

      <section className="page-shell report-preview">
        <div className="report-preview__header">
          <p className="section-kicker">Featured Report</p>
          <h2>{currentPhoto.title}</h2>
          <p>{currentPhoto.description}</p>
          <div className="report-preview__meta">
            <span>{currentPhoto.species}</span>
            <span>{currentPhoto.location}</span>
          </div>
        </div>

        <div className="report-preview__stack">
          {reportPhotos.map((photo) => (
            <article key={photo.id} className="report-photo">
              <img src={photo.imageUrl} alt={photo.title} />
              <div className="report-photo__caption">
                <p>{photo.title}</p>
                <span>{photo.species}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell journey-banner">
        <div className="journey-banner__content">
          <p className="section-kicker">Browse More</p>
          <h2>More photographs will slot naturally into this same image-led rhythm.</h2>
          <p>
            As you add more work later, the gallery can grow like an expedition archive
            rather than a card wall.
          </p>
        </div>
        <Link to="/gallery" className="button button--secondary">
          View Archive
        </Link>
      </section>
    </div>
  );
};

export default Hero;
