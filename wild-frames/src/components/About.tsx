import { motion } from 'framer-motion';
import { pageVariants, sectionVariants } from '../lib/motionVariants';

function About() {
  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="about-layout">
        <motion.div
          className="page-intro"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <p className="section-kicker">About</p>
          <h1>A wildlife photographer building a slower, more atmospheric archive.</h1>
          <p>
            WildFrames is shaped around close observation, habitat awareness, and a visual
            language that lets wildlife feel rooted in place rather than isolated from it.
          </p>
        </motion.div>

        <motion.div
          className="about-card"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2>The approach</h2>
          <p>
            The photographs here are meant to feel grounded and generous. That means natural
            light, minimal interference, and compositions that preserve the mood of the
            encounter.
          </p>
          <p>
            The redesign follows the same philosophy: softer contrast, organic spacing,
            earthy color, and typography that feels more like a field publication than a
            software template.
          </p>
        </motion.div>

        <motion.div
          className="detail-list detail-list--about"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div>
            <span>Base region</span>
            <strong>Karnataka, India</strong>
          </div>
          <div>
            <span>Favorite subjects</span>
            <strong>Snakes, forest-edge species, and intimate wildlife portraits</strong>
          </div>
          <div>
            <span>Creative intention</span>
            <strong>To make people feel calmer, more curious, and more protective of wild spaces</strong>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default About;
