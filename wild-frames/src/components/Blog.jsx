import React from 'react';

const fieldNotes = [
  {
    title: 'How patience changes a wildlife frame',
    excerpt:
      'The most memorable reptile photographs often happen after the camera has already been still for a while. Field patience shapes composition as much as technique.',
    meta: 'Observation, ethics, and timing'
  },
  {
    title: 'Photographing snakes without losing the atmosphere',
    excerpt:
      'Habitat matters. Wide negative space, natural textures, and low-contrast light help a frame feel true to the encounter instead of staged.',
    meta: 'Composition in the field'
  },
  {
    title: 'Why field notes belong beside the gallery',
    excerpt:
      'A photograph can stop someone. A story keeps them there. Pairing the frame with context gives the collection more weight and personality.',
    meta: 'Storytelling and conservation'
  }
];

const Blog = () => {
  return (
    <section className="page-shell page-shell--top">
      <div className="page-intro">
        <p className="section-kicker">Field Notes</p>
        <h1>Short essays on habitat, behavior, and the craft behind the frame.</h1>
        <p>
          This section now supports the same editorial tone as the homepage, so the site
          feels like a nature journal instead of a disconnected blog placeholder.
        </p>
      </div>

      <div className="notes-grid">
        {fieldNotes.map((note) => (
          <article key={note.title} className="note-card">
            <p className="note-card__meta">{note.meta}</p>
            <h2>{note.title}</h2>
            <p>{note.excerpt}</p>
            <button type="button" className="text-link text-link--button">
              Story coming soon
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Blog;
