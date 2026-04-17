import { describe, it, expect } from 'vitest';
import { pathToSlug, getAllNotesFromModules } from './fieldNotes';
import type { FieldNoteMeta } from '../types';

describe('pathToSlug', () => {
  it('strips directory and .mdx extension', () => {
    expect(pathToSlug('/content/field-notes/snake-patience.mdx')).toBe('snake-patience');
  });

  it('handles nested paths', () => {
    expect(pathToSlug('a/b/c/my-note.mdx')).toBe('my-note');
  });

  it('handles filename with no directory', () => {
    expect(pathToSlug('simple.mdx')).toBe('simple');
  });
});

const makeMeta = (overrides: Partial<FieldNoteMeta> = {}): FieldNoteMeta => ({
  title: 'Test Note',
  date: '2024-01-01',
  meta: 'Test meta',
  excerpt: 'Test excerpt',
  ...overrides,
});

describe('getAllNotesFromModules', () => {
  it('returns entries with slugs derived from paths', () => {
    const modules = {
      '/content/field-notes/snake-patience.mdx': { frontmatter: makeMeta({ title: 'Snake Patience' }) },
    };
    const result = getAllNotesFromModules(modules);
    expect(result[0].slug).toBe('snake-patience');
    expect(result[0].title).toBe('Snake Patience');
  });

  it('sorts entries by date descending', () => {
    const modules = {
      '/content/field-notes/older.mdx': { frontmatter: makeMeta({ date: '2023-06-01' }) },
      '/content/field-notes/newer.mdx': { frontmatter: makeMeta({ date: '2024-03-15' }) },
    };
    const result = getAllNotesFromModules(modules);
    expect(result[0].slug).toBe('newer');
    expect(result[1].slug).toBe('older');
  });

  it('returns empty array for empty modules', () => {
    expect(getAllNotesFromModules({})).toEqual([]);
  });

  it('preserves all frontmatter fields', () => {
    const meta = makeMeta({ title: 'Full Note', excerpt: 'Rich excerpt', meta: 'Field craft', coverImage: '/img/cover.jpg' });
    const modules = { '/content/field-notes/full-note.mdx': { frontmatter: meta } };
    const [entry] = getAllNotesFromModules(modules);
    expect(entry.coverImage).toBe('/img/cover.jpg');
    expect(entry.excerpt).toBe('Rich excerpt');
  });
});
