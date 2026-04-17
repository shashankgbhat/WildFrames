declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { FieldNoteMeta } from './index';

  export const frontmatter: FieldNoteMeta;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
