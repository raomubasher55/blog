import { Container, Heading, Text, Card, Box, Flex, Badge, Button, Grid, Link as RadixLink, Section, DropdownMenu } from "@radix-ui/themes";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogPost } from "@/types/blog";
import { 
  Flame, 
  Calendar, 
  MessageCircle, 
  ArrowRight, 
  Bot, 
  Code, 
  Zap, 
  Database, 
  Atom, 
  Link as LinkIcon,
  Settings,
  FileText,
  Heart,
  ExternalLink,
  Menu
} from "lucide-react";

export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechBlog';
  
  return {
    title: `Latest Tech News & AI Insights | ${siteName}`,
    description: 'Discover cutting-edge technology news, AI breakthroughs, and programming tutorials. Stay ahead with expert analysis on software development trends.',
    keywords: 'tech news, AI news, programming tutorials, software development, technology trends, artificial intelligence',
    openGraph: {
      title: `Latest Tech News & AI Insights | ${siteName}`,
      description: 'Discover cutting-edge technology news, AI breakthroughs, and programming tutorials.',
    },
  };
}

export default async function Home() {
  let posts: BlogPost[] = [];
  let errorMessage = '';
  
  try {
    posts = await getAllPosts();
    console.log('Fetched posts:', posts.length);
  } catch (error) {
    console.error('Error fetching posts:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const trendingPosts = posts.slice(4, 8);
  const allPosts = posts.slice(1, 12);

  // Organization Schema for homepage
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechBlog';
  const twitterHandle = process.env.TWITTER_HANDLE || '@techblog';
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Stay updated with the latest technology news, insights, and analysis. Covering AI, software development, and industry trends.",
    "sameAs": [
      `https://twitter.com/${twitterHandle.replace('@', '')}`,
      `https://github.com/${siteName.toLowerCase()}`
    ]
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <Container size="4">
          <Flex justify="between" align="center" className="h-16" px={{ initial: '4', md: '0' }}>
            <Link href="/">
              <Heading 
                size={{ initial: '4', sm: '6' }} 
                className="font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
              >
                TechBlog
              </Heading>
            </Link>
            
            {/* Desktop Navigation */}
            <Box display={{ initial: 'none', md: 'block' }}>
              <Flex gap="6" align="center">
                <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium flex items-center gap-1">
                  <FileText size={16} />
                  Latest
                </Link>
                <Link href="#ai-tools" className="text-gray-700 hover:text-orange-500 font-medium flex items-center gap-1">
                  <Bot size={16} />
                  AI Tools
                </Link>
                <Link href="#programming" className="text-gray-700 hover:text-orange-500 font-medium flex items-center gap-1">
                  <Code size={16} />
                  Programming
                </Link>
              </Flex>
            </Box>

            {/* Mobile Navigation */}
            <Box display={{ initial: 'block', md: 'none' }}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="2">
                    <Menu size={20} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" sideOffset={5}>
                  <DropdownMenu.Item asChild>
                    <Link href="/" className="flex items-center gap-2 w-full">
                      <FileText size={16} />
                      Latest Articles
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="#ai-tools" className="flex items-center gap-2 w-full">
                      <Bot size={16} />
                      AI Tools & Reviews
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="#programming" className="flex items-center gap-2 w-full">
                      <Code size={16} />
                      Programming & Dev
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item asChild>
                    <Link href="/admin" className="flex items-center gap-2 w-full">
                      <Settings size={16} />
                      Admin Panel
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Box>
          </Flex>
        </Container>
      </header>

      {/* Hero Featured Article */}
      {featuredPost && (
        <Section className="py-12 bg-gradient-to-br from-gray-50 to-orange-50">
          <Container size="4">
            <Card size="4" className="overflow-hidden shadow-xl border-0">
              <Box className="bg-gradient-to-r from-orange-500 to-red-600 h-1"></Box>
              <Box p="8">
                <Grid columns={{ initial: '1', lg: '3' }} gap="8" align="start">
                  <Box className="lg:col-span-2">
                    <Badge color="orange" variant="soft" size="2" mb="4">
                      <Flame size={16} className="inline mr-1" />
                      Featured Article
                    </Badge>
                    
                    <Link href={`/blog/${featuredPost.slug || featuredPost._id}`}>
                      <Heading 
                        size="8" 
                        mb="4" 
                        className="hover:text-orange-600 transition-colors cursor-pointer leading-tight"
                      >
                        {featuredPost.title}
                      </Heading>
                    </Link>
                    
                    <Text size="4" color="gray" mb="6" className="leading-relaxed">
                      {featuredPost.summary}
                    </Text>
                    
                    <Flex gap="4" align="center" wrap="wrap" mb="6">
                      <Badge color="gray" variant="soft">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Badge>
                      
                      {featuredPost.faqs && featuredPost.faqs.length > 0 && (
                        <Badge className="bg-green-500 text-white">
                          <MessageCircle size={14} className="inline mr-1" />
                          {featuredPost.faqs.length} FAQ{featuredPost.faqs.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </Flex>
                    
                    <Link href={`/blog/${featuredPost.slug || featuredPost._id}`}>
                      <Button size="3">
                        Read Full Article
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </Box>
                  
                  <Box className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-8 h-full flex items-center justify-center">
                      <div className="text-center">
                        <Bot size={64} className="text-orange-500 mx-auto mb-4" />
                        <Text size="3" color="gray">AI & Tech Insights</Text>
                      </div>
                    </div>
                  </Box>
                </Grid>
              </Box>
            </Card>
          </Container>
        </Section>
      )}

      {/* Latest Articles Grid */}
      <Section className="py-12">
        <Container size="4">
          <Flex justify="between" align="center" mb="8">
            <Heading size="7">Latest Articles</Heading>
            <Text size="3" color="gray">
              Stay updated with cutting-edge tech insights
            </Text>
          </Flex>

          <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="8">
            {allPosts.map((post, index) => (
              <Card key={post._id} className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-200">
                <Box p="6">
                  <Flex direction="column" gap="4" height="100%">
                    <Flex justify="between" align="center" mb="2">
                      <Badge color="gray" variant="soft" size="1">
                        <Calendar size={12} className="inline mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                      {post.faqs && post.faqs.length > 0 && (
                        <Badge className="bg-green-500 text-white" size="1">
                          <MessageCircle size={12} className="inline mr-1" />
                          FAQ
                        </Badge>
                      )}
                    </Flex>
                    
                    <Link href={`/blog/${post.slug || post._id}`}>
                      <Heading 
                        size="4" 
                        mb="3" 
                        className="hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {post.title}
                      </Heading>
                    </Link>
                    
                    <Text 
                      size="2" 
                      color="gray" 
                      className="line-clamp-3 leading-relaxed flex-grow"
                    >
                      {post.meta_description}
                    </Text>
                    
                    <Link href={`/blog/${post.slug || post._id}`}>
                      <Button size="2" className="w-full">
                        Read Article
                      </Button>
                    </Link>
                  </Flex>
                </Box>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* High-Value Content Sections */}
      <Section id="ai-tools" className="py-12 bg-gray-50">
        <Container size="4">
          <Box className="text-center mb-12">
            <Heading size="7" mb="4">
              <Bot size={32} className="inline mr-2 text-orange-500" />
              AI Tools & Reviews
            </Heading>
            <Text size="4" color="gray" className="max-w-2xl mx-auto">
              Discover the latest AI tools, comprehensive reviews, and practical guides for developers and businesses
            </Text>
          </Box>
          
          <Grid columns={{ initial: '1', md: '2' }} gap="8">
            <Card className="p-6 border border-gray-200 hover:border-orange-200 transition-colors">
              <Heading size="5" mb="3">
                <Bot size={24} className="inline mr-2 text-orange-500" />
                AI Tool Comparisons
              </Heading>
              <Text color="gray" mb="4">
                In-depth comparisons of popular AI tools like ChatGPT vs Claude, Midjourney vs DALL-E, and more.
              </Text>
              <Badge color="orange" variant="soft">Low Competition</Badge>
            </Card>
            
            <Card className="p-6 border border-gray-200 hover:border-orange-200 transition-colors">
              <Heading size="5" mb="3">
                <Zap size={24} className="inline mr-2 text-yellow-500" />
                No-Code AI Solutions
              </Heading>
              <Text color="gray" mb="4">
                Build AI-powered applications without coding using tools like Bubble, Zapier, and Make.com.
              </Text>
              <Badge className="bg-green-500 text-white">High Search Volume</Badge>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Programming Section */}
      <Section id="programming" className="py-12">
        <Container size="4">
          <Box className="text-center mb-12">
            <Heading size="7" mb="4">
              <Code size={32} className="inline mr-2 text-blue-500" />
              Programming & Development
            </Heading>
            <Text size="4" color="gray" className="max-w-2xl mx-auto">
              Tutorials, best practices, and emerging technologies for modern developers
            </Text>
          </Box>
          
          <Grid columns={{ initial: '1', md: '3' }} gap="6">
            <Card className="p-6 text-center border border-gray-200 hover:border-orange-200 transition-colors">
              <Code size={48} className="text-green-500 mx-auto mb-4" />
              <Heading size="4" mb="3">Python for AI</Heading>
              <Text size="2" color="gray">
                Learn Python frameworks for machine learning and AI development
              </Text>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:border-orange-200 transition-colors">
              <Atom size={48} className="text-blue-500 mx-auto mb-4" />
              <Heading size="4" mb="3">React & Next.js</Heading>
              <Text size="2" color="gray">
                Modern web development with React ecosystem and best practices
              </Text>
            </Card>
            
            <Card className="p-6 text-center border border-gray-200 hover:border-orange-200 transition-colors">
              <LinkIcon size={48} className="text-purple-500 mx-auto mb-4" />
              <Heading size="4" mb="3">Blockchain Dev</Heading>
              <Text size="2" color="gray">
                Smart contracts, DApps, and Web3 development tutorials
              </Text>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Newsletter Signup */}
      <Section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <Container size="3">
          <Box className="text-center">
            <Heading size="7" mb="4" className="text-white">
              Stay Ahead of the Curve
            </Heading>
            <Text size="4" mb="8" className="text-orange-100 max-w-2xl mx-auto">
              Get weekly insights on AI tools, programming tutorials, and tech industry trends delivered to your inbox.
            </Text>
            <Flex gap="4" justify="center" className="max-w-lg mx-auto">
              <Button size="3" className="newsletter-button font-medium">
                Subscribe to Newsletter
              </Button>
            </Flex>
          </Box>
        </Container>
      </Section>

      {/* Empty State for No Posts */}
      {posts.length === 0 && (
        <Section className="py-20 text-center">
          <Container size="3">
            <FileText size={96} className="text-gray-400 mx-auto mb-8" />
            <Heading size="8" mb="6">Ready to Start Blogging?</Heading>
            <Text size="4" color="gray" mb="6" className="max-w-2xl mx-auto">
              Create your first tech article and start sharing valuable insights with the developer community.
            </Text>
            {errorMessage && (
              <Text size="3" color="red" mb="6" className="max-w-2xl mx-auto">
                Database Error: {errorMessage}
              </Text>
            )}
            <Link href="/admin">
              <Button size="4">
                Create Your First Post
              </Button>
            </Link>
          </Container>
        </Section>
      )}

      {/* Footer */}
      <footer style={{backgroundColor: '#2b2b2b'}} className="text-white">
        <Container size="4">
          <Box className="py-16">
            <Grid columns={{ initial: '1', md: '4' }} gap="8" mb="8">
              <Box>
                <Heading size="5" mb="4">TechBlog</Heading>
                <Text size="3" mb="4">
                  Your source for AI tools, programming tutorials, and tech industry insights.
                </Text>
              </Box>
              
              <Box>
                <Heading size="4" mb="4">Content</Heading>
                <Flex direction="column" gap="2">
                  <RadixLink href="#ai-tools" size="3">
                    AI Tools
                  </RadixLink>
                  <RadixLink href="#programming" size="3">
                    Programming
                  </RadixLink>
                  <RadixLink href="/" size="3">
                    Latest Articles
                  </RadixLink>
                </Flex>
              </Box>
              
              <Box>
                <Heading size="4" mb="4">Admin</Heading>
                <Flex direction="column" gap="2">
                  <RadixLink href="/admin" size="3">
                    Dashboard
                  </RadixLink>
                  <RadixLink href="/sitemap.xml" size="3">
                    Sitemap
                  </RadixLink>
                </Flex>
              </Box>
              
              <Box>
                <Heading size="4" mb="4">Connect</Heading>
                <Text size="2">
                  Built with Next.js, MongoDB & Radix UI
                </Text>
              </Box>
            </Grid>
            
            <Box className="border-t border-gray-600 pt-8">
              <Flex justify="between" align="center" wrap="wrap" gap="4">
                <Text size="2">
                  © {new Date().getFullYear()} TechBlog. All rights reserved.
                </Text>
                <Text size="2" className="flex items-center gap-1">
                  Made with <Heart size={14} className="text-red-500" /> for developers
                </Text>
              </Flex>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  );
}