import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, sectionVariants } from '../lib/motionVariants';
import type { FieldNoteMeta } from '../types';

interface Props {
  meta: FieldNoteMeta;
  children: ReactNode;
}

function FieldNoteLayout({ meta, children }: Props) {
  return (
    <motion.article
      className="page-shell page-shell--top field-note"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link to="/blog" className="back-link">← Field Notes</Link>

      {meta.coverImage && (
        <div className="field-note__cover">
          <img src={meta.coverImage} alt={meta.title} />
        </div>
      )}

      <motion.header
        className="field-note__header"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <p className="section-kicker">{meta.meta}</p>
        <h1>{meta.title}</h1>
        <time className="field-note__date" dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
      </motion.header>

      <motion.div
        className="field-note__body prose"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </motion.article>
  );
}

export default FieldNoteLayout;
