import React, { useEffect, useMemo, useState } from 'react';
import photosData from '../data/photos.json';

const rowPatterns = [
  { rowClass: 'trip-gallery__row trip-gallery__row--hero', count: 2, itemClasses: ['trip-gallery__item trip-gallery__item--wide', 'trip-gallery__item trip-gallery__item--wide'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--triple', count: 3, itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--feature-left', count: 3, itemClasses: ['trip-gallery__item trip-gallery__item--feature', 'trip-gallery__item', 'trip-gallery__item'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--feature-right', count: 3, itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item trip-gallery__item--feature'] }
];

const Gallery = () => {
  const photos = useMemo(() => photosData.photos, []);
  const [activeIndex, setActiveIndex] = useState(null);
  const photoIndexById = useMemo(
    () => new Map(photos.map((photo, index) => [photo.id, index])),
    [photos]
  );
  const galleryRows = useMemo(() => {
    const rows = [];
    let photoIndex = 0;
    let patternIndex = 0;

    while (photoIndex < photos.length) {
      const pattern = rowPatterns[patternIndex % rowPatterns.length];
      const slice = photos.slice(photoIndex, photoIndex + pattern.count);
      const adjustedClass =
        slice.length === 1
          ? 'trip-gallery__row trip-gallery__row--single'
          : slice.length === 2
            ? 'trip-gallery__row trip-gallery__row--double'
            : pattern.rowClass;

      rows.push({
        rowClass: adjustedClass,
        photos: slice,
        itemClasses: pattern.itemClasses
      });

      photoIndex += slice.length;
      patternIndex += 1;
    }

    return rows;
  }, [photos]);

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current + 1) % photos.length);
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, photos.length]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % photos.length);
  };

  return (
    <section className="page-shell page-shell--top">
      <div className="page-intro page-intro--narrow">
        <p className="section-kicker">Trip Report Style Gallery</p>
        <h1>A collage-led archive with a proper image viewer.</h1>
        <p>
          The gallery now follows the expedition collage feel you pointed out, with
          clickable images that open into a full-screen lightbox with captions and arrows.
        </p>
      </div>

      <div className="gallery-bleed">
        <div className="trip-gallery trip-gallery--rows">
          {galleryRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={row.rowClass}>
              {row.photos.map((photo, itemIndex) => {
                const photoIndex = photoIndexById.get(photo.id);

                return (
                  <button
                    key={photo.id}
                    type="button"
                    className={row.itemClasses[itemIndex] || 'trip-gallery__item'}
                    onClick={() => setActiveIndex(photoIndex)}
                    aria-label={`Open ${photo.title}`}
                  >
                    <img src={photo.imageUrl} alt={photo.title} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {activePhoto ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image viewer"
          >
            ×
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="lightbox__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={activePhoto.imageUrl} alt={activePhoto.title} className="lightbox__image" />
            <div className="lightbox__caption">
              <h2>{activePhoto.title}</h2>
              <p>{activePhoto.description}</p>
              <span>
                {activePhoto.species} • {activePhoto.location}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default Gallery;
