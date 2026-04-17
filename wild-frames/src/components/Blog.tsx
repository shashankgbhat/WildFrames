import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants, childVariants } from '../lib/motionVariants';
import { getAllNotes } from '../lib/fieldNotes';

const notes = getAllNotes();

function Blog() {
  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="page-intro">
        <p className="section-kicker">Field Notes</p>
        <h1>Short essays on habitat, behavior, and the craft behind the frame.</h1>
        <p>
          Each note pairs the photograph with context — giving the collection more weight
          and personality than a gallery alone.
        </p>
      </div>

      <motion.div
        className="notes-grid"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {notes.map((note) => (
          <motion.article key={note.slug} className="note-card" variants={childVariants}>
            <p className="note-card__meta">{note.meta}</p>
            <h2>{note.title}</h2>
            <p>{note.excerpt}</p>
            <Link to={`/blog/${note.slug}`} className="text-link">
              Read note →
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default Blog;
