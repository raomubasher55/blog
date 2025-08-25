import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { BlogPost } from '@/types/blog';
import { Calendar, MessageCircle, ExternalLink, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug || post._id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechBlog';

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const postUrl = `${siteUrl}/blog/${post.slug || post._id}`;

  return {
    title: post.title,
    description: post.meta_description,
    keywords: post.title.toLowerCase().split(' ').join(', '),
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      publishedTime: post.date,
      url: postUrl,
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description,
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

function generateStructuredData(post: BlogPost) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechBlog';
  const postUrl = `${siteUrl}/blog/${post.slug || post._id}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${postUrl}#article`,
        headline: post.title,
        description: post.meta_description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Organization',
          name: `${siteName} Team`,
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        url: postUrl,
      },
    ],
  };

  if (post.faqs && post.faqs.length > 0) {
    structuredData['@graph'].push({
      '@type': 'FAQPage',
      '@id': `${postUrl}#faq`,
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return structuredData;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const structuredData = generateStructuredData(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Header with Back Button */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-gray-600 hover:text-orange-500 transition-colors duration-200 cursor-pointer group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Articles</span>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <article>
            <header className="mb-12">
              {/* Date Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              {/* Summary */}
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium mb-8">
                {post.summary}
              </p>
              
              <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </header>

            <main className="prose prose-lg max-w-none">
              {/* Article Content */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
                <p className="text-lg leading-relaxed text-gray-700 font-normal">
                  {post.summary}
                </p>
              </div>

              {/* Source Reference */}
              {post.reference && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-12">
                  <div className="flex items-start gap-3">
                    <ExternalLink size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                        Source Reference
                      </h3>
                      <a 
                        href={post.reference} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all text-sm cursor-pointer transition-colors duration-200"
                      >
                        {post.reference}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <section className="mt-16">
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      <MessageCircle size={32} className="text-orange-500" />
                      Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                      Common questions and detailed answers about this topic
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {post.faqs.map((faq, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </main>

            {/* Related Articles CTA */}
            <div className="mt-16 text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-12 border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Explore More Tech Articles
              </h3>
              <p className="text-gray-600 mb-6">
                Discover the latest insights in technology, AI, and programming
              </p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg"
              >
                View All Articles
                <ExternalLink size={16} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}