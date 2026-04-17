import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, childVariants } from '../lib/motionVariants';
import type { Photo } from '../types';
import photosData from '../data/photos.json';

interface RowPattern {
  rowClass: string;
  count: number;
  itemClasses: string[];
}

interface GalleryRow {
  rowClass: string;
  photos: (Photo & { globalIndex: number })[];
  itemClasses: string[];
}

const rowPatterns: RowPattern[] = [
  { rowClass: 'trip-gallery__row trip-gallery__row--hero',         count: 2, itemClasses: ['trip-gallery__item trip-gallery__item--wide', 'trip-gallery__item trip-gallery__item--wide'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--triple',       count: 3, itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--feature-left', count: 3, itemClasses: ['trip-gallery__item trip-gallery__item--feature', 'trip-gallery__item', 'trip-gallery__item'] },
  { rowClass: 'trip-gallery__row trip-gallery__row--feature-right',count: 3, itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item trip-gallery__item--feature'] },
];

const photos = photosData.photos as Photo[];

const galleryRows: GalleryRow[] = (() => {
  const rows: GalleryRow[] = [];
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
      photos: slice.map((photo, i) => ({ ...photo, globalIndex: photoIndex + i })),
      itemClasses: pattern.itemClasses,
    });

    photoIndex += slice.length;
    patternIndex += 1;
  }

  return rows;
})();

function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => ((current ?? 0) - 1 + photos.length) % photos.length);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (((current ?? 0) + 1) % photos.length));
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape')     setActiveIndex(null);
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft')  showPrevious();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, showNext, showPrevious]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="page-intro page-intro--narrow">
        <p className="section-kicker">Trip Report Style Gallery</p>
        <h1>A collage-led archive with a proper image viewer.</h1>
        <p>
          The gallery follows the expedition collage feel, with clickable images that open
          into a full-screen lightbox with captions and arrows.
        </p>
      </div>

      <div className="gallery-bleed">
        <div className="trip-gallery trip-gallery--rows">
          {galleryRows.map((row) => (
            <motion.div
              key={row.photos[0].id}
              className={row.rowClass}
              variants={containerVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
            >
              {row.photos.map((photo, itemIndex) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  className={row.itemClasses[itemIndex] ?? 'trip-gallery__item'}
                  onClick={() => setActiveIndex(photo.globalIndex)}
                  aria-label={`Open ${photo.title}`}
                  variants={childVariants}
                >
                  <img src={photo.imageUrl} alt={photo.title} />
                </motion.button>
              ))}
            </motion.div>
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
            onClick={(e) => { e.stopPropagation(); showPrevious(); }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="lightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activePhoto.imageUrl} alt={activePhoto.title} className="lightbox__image" />
            <div className="lightbox__caption">
              <h2>{activePhoto.title}</h2>
              <p>{activePhoto.description}</p>
              <span>{activePhoto.species} • {activePhoto.location}</span>
            </div>
          </div>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      ) : null}
    </motion.section>
  );
}

export default Gallery;
