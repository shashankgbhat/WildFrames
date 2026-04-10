import React from 'react';

const About = () => {
  return (
    <section className="page-shell page-shell--top">
      <div className="about-layout">
        <div className="page-intro">
          <p className="section-kicker">About</p>
          <h1>A wildlife photographer building a slower, more atmospheric archive.</h1>
          <p>
            WildFrames is shaped around close observation, habitat awareness, and a visual
            language that lets wildlife feel rooted in place rather than isolated from it.
          </p>
        </div>

        <div className="about-card">
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
        </div>

        <div className="detail-list detail-list--about">
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
        </div>
      </div>
    </section>
  );
};

export default About;
