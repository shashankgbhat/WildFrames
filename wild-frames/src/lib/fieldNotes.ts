import type { FieldNoteMeta, FieldNoteEntry } from '../types';

export function pathToSlug(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.mdx$/, '');
}

type NoteModules = Record<string, { frontmatter: FieldNoteMeta }>;

export function getAllNotesFromModules(modules: NoteModules): FieldNoteEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({ slug: pathToSlug(path), ...mod.frontmatter }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const _modules = import.meta.glob<{ frontmatter: FieldNoteMeta }>(
  '/content/field-notes/*.mdx',
  { eager: true },
);

export function getAllNotes(): FieldNoteEntry[] {
  return getAllNotesFromModules(_modules);
}
