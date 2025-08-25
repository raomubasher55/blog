import mongoose from 'mongoose';

interface IFAQ {
  question: string;
  answer: string;
}

interface IBlogPost {
  title: string;
  summary: string;
  meta_description: string;
  date: string;
  reference: string;
  slug?: string;
  faqs: IFAQ[];
}

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  meta_description: { type: String, required: true },
  date: { type: String, required: true },
  reference: { type: String, required: true },
  slug: { type: String },
  faqs: [FAQSchema]
}, {
  timestamps: true,
  collection: 'blogg'
});

BlogPostSchema.pre('save', function() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;