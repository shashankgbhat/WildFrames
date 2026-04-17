import { Navigate, useParams } from 'react-router-dom';
import type { FieldNoteMeta } from '../types';
import type { ComponentType } from 'react';
import FieldNoteLayout from './FieldNoteLayout';

type MdxModule = { default: ComponentType; frontmatter: FieldNoteMeta };

const mdxModules = import.meta.glob<MdxModule>('/content/field-notes/*.mdx', { eager: true });

function FieldNotePage() {
  const { slug } = useParams<{ slug: string }>();

  const entry = Object.entries(mdxModules).find(([path]) =>
    path.endsWith(`/${slug}.mdx`)
  );

  if (!entry) return <Navigate to="/blog" replace />;

  const { default: Content, frontmatter } = entry[1];

  return (
    <FieldNoteLayout meta={frontmatter}>
      <Content />
    </FieldNoteLayout>
  );
}

export default FieldNotePage;
