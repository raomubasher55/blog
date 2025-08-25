import connectDB from './mongoose';
import BlogPost from '@/models/BlogPost';
import { BlogPost as BlogPostType, BlogPostCreate } from '@/types/blog';

export async function getAllPosts(): Promise<BlogPostType[]> {
  try {
    await connectDB();
    
    const posts = await BlogPost.find({})
      .sort({ date: -1 })
      .lean();
    
    return posts.map((post: Record<string, unknown>) => ({
      ...post,
      _id: (post._id as { toString: () => string }).toString(),
      slug: (post.slug as string) || generateSlug(post.title as string)
    })) as BlogPostType[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostType | null> {
  try {
    await connectDB();
    
    // Try to find by slug first, then by ObjectId if it's a valid ObjectId
    let post;
    
    // First try to find by slug
    post = await BlogPost.findOne({ slug: slug }).lean();
    
    // If not found and slug looks like an ObjectId, try finding by _id
    if (!post && slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findById(slug).lean();
    }
    
    if (!post) return null;
    
    return {
      ...(post as Record<string, unknown>),
      _id: ((post as Record<string, unknown>)._id as { toString: () => string }).toString(),
      slug: ((post as Record<string, unknown>).slug as string) || generateSlug((post as Record<string, unknown>).title as string)
    } as BlogPostType;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function createPost(postData: BlogPostCreate): Promise<string> {
  try {
    await connectDB();
    
    const post = new BlogPost({
      ...postData,
      slug: generateSlug(postData.title),
      date: postData.date || new Date().toISOString().split('T')[0]
    });
    
    const savedPost = await post.save();
    return savedPost._id.toString();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id: string, postData: Partial<BlogPostCreate>): Promise<boolean> {
  try {
    await connectDB();
    
    const updateData = {
      ...postData,
      ...(postData.title && { slug: generateSlug(postData.title) })
    };
    
    const result = await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
    return !!result;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await connectDB();
    
    const result = await BlogPost.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}