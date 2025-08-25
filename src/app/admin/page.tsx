'use client';

import { useState, useEffect } from 'react';
import { Container, Heading, Button, Card, Box, Flex, Text, Dialog, TextField, TextArea, Badge, AlertDialog } from '@radix-ui/themes';
import { BlogPost, BlogPostCreate, FAQ } from '@/types/blog';
import { Plus, Edit, Trash2, Calendar, MessageCircle, Settings } from 'lucide-react';

export default function AdminPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<BlogPostCreate>({
    title: '',
    summary: '',
    meta_description: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    faqs: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEdit = async () => {
    if (!editingPost) return;
    
    try {
      const response = await fetch(`/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingPost(null);
        resetForm();
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmPost) return;
    
    try {
      const response = await fetch(`/api/posts/${deleteConfirmPost._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDeleteConfirmPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      summary: post.summary,
      meta_description: post.meta_description,
      date: post.date,
      reference: post.reference,
      faqs: post.faqs || []
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      meta_description: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      faqs: []
    });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData({ ...formData, faqs: newFaqs });
  };

  const removeFAQ = (index: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index)
    });
  };

  const PostForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <Flex direction="column" gap="4">
      <Box>
        <Text size="2" mb="2" as="label">Title</Text>
        <TextField.Root
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter post title"
        />
      </Box>

      <Box>
        <Text size="2" mb="2" as="label">Summary</Text>
        <TextArea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Enter post summary"
          rows={4}
        />
      </Box>

      <Box>
        <Text size="2" mb="2" as="label">Meta Description</Text>
        <TextArea
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          placeholder="SEO meta description"
          rows={2}
        />
      </Box>

      <Box>
        <Text size="2" mb="2" as="label">Date</Text>
        <TextField.Root
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </Box>

      <Box>
        <Text size="2" mb="2" as="label">Reference URL</Text>
        <TextField.Root
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="https://example.com/source"
        />
      </Box>

      <Box>
        <Flex justify="between" align="center" mb="3">
          <Text size="2" className="flex items-center gap-1">
            <MessageCircle size={16} />
            FAQs
          </Text>
          <Button size="1" variant="soft" onClick={addFAQ} className="flex items-center gap-1">
            <Plus size={14} />
            Add FAQ
          </Button>
        </Flex>
        
        <Flex direction="column" gap="3">
          {formData.faqs.map((faq, index) => (
            <Card key={index} size="1">
              <Box p="3">
                <Flex direction="column" gap="2">
                  <TextField.Root
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    placeholder="FAQ Question"
                  />
                  <TextArea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    placeholder="FAQ Answer"
                    rows={2}
                  />
                  <Button size="1" color="red" variant="soft" onClick={() => removeFAQ(index)}>
                    Remove
                  </Button>
                </Flex>
              </Box>
            </Card>
          ))}
        </Flex>
      </Box>

      <Flex gap="2" justify="end">
        <Button variant="soft" onClick={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </Flex>
    </Flex>
  );

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Flex justify="center" align="center" className="min-h-64">
          <Text size="4">Loading posts...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-4 px-4 sm:py-8">
      {/* Header - Stack on mobile */}
      <Flex 
        direction={{ initial: 'column', sm: 'row' }} 
        justify="between" 
        align={{ initial: 'stretch', sm: 'center' }} 
        gap="4" 
        mb="6"
      >
        <Heading 
          size={{ initial: '6', sm: '8' }} 
          className="flex items-center gap-2 text-center sm:text-left"
        >
          <Settings size={{ base: 24, sm: 32 }} className="text-orange-500" />
          Admin Panel
        </Heading>
        <Button 
          onClick={openCreateDialog} 
          className="flex items-center gap-2 justify-center w-full sm:w-auto"
          size={{ initial: '3', sm: '2' }}
        >
          <Plus size={16} />
          <Text className="hidden xs:inline">Create New Post</Text>
          <Text className="xs:hidden">Create</Text>
        </Button>
      </Flex>

      {posts.length === 0 ? (
        <Card size="3" className="text-center py-8 sm:py-16">
          <Box className="px-4">
            <Plus size={{ base: 48, sm: 64 }} className="text-gray-400 mx-auto mb-4" />
            <Heading size={{ initial: '5', sm: '6' }} mb="4">No Posts Yet</Heading>
            <Text size={{ initial: '2', sm: '3' }} color="gray" mb="6" className="max-w-md mx-auto">
              Start building your blog by creating your first post. Share your insights and expertise with the world!
            </Text>
            <Button 
              onClick={openCreateDialog} 
              className="flex items-center gap-2 mx-auto w-full sm:w-auto"
              size="3"
            >
              <Plus size={16} />
              Create Your First Post
            </Button>
          </Box>
        </Card>
      ) : (
        <Flex direction="column" gap="4">
          {posts.map((post) => (
          <Card key={post._id} size="2">
            <Box p={{ initial: '3', sm: '4' }}>
              <Flex 
                direction={{ initial: 'column', sm: 'row' }} 
                justify="between" 
                align={{ initial: 'stretch', sm: 'start' }} 
                gap="4"
              >
                <Box className="flex-1 min-w-0">
                  <Heading 
                    size={{ initial: '3', sm: '4' }} 
                    mb="2" 
                    className="line-clamp-2 sm:line-clamp-1"
                  >
                    {post.title}
                  </Heading>
                  <Text 
                    size="2" 
                    color="gray" 
                    mb="2" 
                    className="flex items-center gap-1 flex-wrap"
                  >
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString()}
                  </Text>
                  <Text size="2" className="line-clamp-2 mb-2">
                    {post.summary}
                  </Text>
                  {post.faqs && post.faqs.length > 0 && (
                    <Badge 
                      color="green" 
                      variant="soft" 
                      size="1" 
                      className="flex items-center gap-1 w-fit"
                    >
                      <MessageCircle size={12} />
                      {post.faqs.length} FAQ{post.faqs.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </Box>
                
                {/* Action buttons - Stack on mobile */}
                <Flex 
                  gap="2" 
                  direction={{ initial: 'row', sm: 'column' }} 
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => openEditDialog(post)}
                    className="flex items-center gap-1 justify-center flex-1 sm:flex-none"
                  >
                    <Edit size={14} />
                    <Text className="hidden xs:inline">Edit</Text>
                  </Button>
                  <Button 
                    size="1" 
                    color="red" 
                    variant="soft"
                    onClick={() => setDeleteConfirmPost(post)}
                    className="flex items-center gap-1 justify-center flex-1 sm:flex-none"
                  >
                    <Trash2 size={14} />
                    <Text className="hidden xs:inline">Delete</Text>
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Card>
        ))}
        </Flex>
      )}

      <Dialog.Root open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <Dialog.Content maxWidth="95vw" style={{ width: 'min(600px, 95vw)' }}>
          <Dialog.Title className="text-center sm:text-left">Create New Post</Dialog.Title>
          <PostForm onSubmit={handleCreate} submitText="Create Post" />
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Content maxWidth="95vw" style={{ width: 'min(600px, 95vw)' }}>
          <Dialog.Title className="text-center sm:text-left">Edit Post</Dialog.Title>
          <PostForm onSubmit={handleEdit} submitText="Update Post" />
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Root open={!!deleteConfirmPost} onOpenChange={() => setDeleteConfirmPost(null)}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Post</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete &quot;{deleteConfirmPost?.title}&quot;? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Container>
  );
}