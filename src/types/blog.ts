export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  meta_description: string;
  date: string;
  reference: string;
  faqs: FAQ[];
  slug?: string;
}

export type BlogPostCreate = Omit<BlogPost, '_id'>;