export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  species: string;
  location: string;
  region: string;
  style: string;
  featured: boolean;
}

export interface FieldNoteMeta {
  title: string;
  date: string;
  meta: string;
  excerpt: string;
  coverImage?: string;
}

export interface FieldNoteEntry extends FieldNoteMeta {
  slug: string;
}

export interface NavItem {
  path: string;
  label: string;
}
