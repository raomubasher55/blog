import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/blog';
import { BlogPostCreate } from '@/types/blog';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BlogPostCreate = await request.json();
    
    if (!body.title || !body.summary || !body.meta_description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postId = await createPost(body);
    return NextResponse.json({ id: postId }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}