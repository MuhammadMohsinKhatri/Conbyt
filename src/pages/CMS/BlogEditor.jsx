import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaEye, FaImage } from 'react-icons/fa';
import SEOPlugin from '../../components/SEO/SEOPlugin';
import ImageUpload from '../../components/CMS/ImageUpload';
import RichTextEditor from '../../components/CMS/RichTextEditor';
import { fetchAdminBlog, createAdminBlog, updateAdminBlog } from '../../utils/api.js';
import { useToast } from '../../contexts/ToastContext';

const BlogEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    author_name: '',
    author_avatar: '',
    date: new Date().toISOString().split('T')[0],
    read_time: '',
    slug: '',
    // SEO Fields
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    focus_keyword: '',
    og_image: '',
    canonical_url: '',
    published: false,
    featured: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState('');
  const toast = useToast();

  const fetchBlog = useCallback(async () => {
    try {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        navigate('/cms/login');
        return;
      }
      
      console.log('Fetching blog with ID:', id);
      const data = await fetchAdminBlog(id, token);
      console.log('Blog data received:', data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      if (error.message && (error.message.includes('401') || error.message.includes('Token'))) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        toast.error('Session expired. Please log in again.');
        navigate('/cms/login');
        return;
      }
      const errorMsg = 'Failed to fetch blog post: ' + error.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [id, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    console.log('BlogEditor useEffect - token exists:', !!token, 'isEdit:', isEdit, 'id:', id);
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/cms/login');
      return;
    }

    if (isEdit && id) {
      console.log('Fetching blog for edit mode');
      fetchBlog();
    } else if (isEdit && !id) {
      console.error('Edit mode but no ID provided');
      setError('No blog ID provided for editing');
    }
  }, [id, isEdit, navigate, fetchBlog]);

  useEffect(() => {
    // Auto-generate slug from title
    if (!isEdit && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  useEffect(() => {
    // Auto-generate meta title from title if empty
    if (!formData.meta_title && formData.title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title }));
    }
  }, [formData.title]);

  useEffect(() => {
    // Auto-generate meta description from excerpt if empty
    if (!formData.meta_description && formData.excerpt) {
      setFormData(prev => ({ ...prev, meta_description: formData.excerpt.substring(0, 160) }));
    }
  }, [formData.excerpt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSlugError('');

    if (!formData.title || !formData.slug || !formData.content) {
      const errorMsg = 'Title, slug, and content are required';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('cms_token');
      
      if (isEdit) {
        await updateAdminBlog(id, formData, token);
        toast.success('Blog post updated successfully');
      } else {
        await createAdminBlog(formData, token);
        toast.success('Blog post created successfully');
      }
      navigate('/cms/blogs');
    } catch (error) {
      if (error.message && error.message.includes('Slug')) {
        setSlugError(error.message);
        toast.error(error.message);
      } else {
        const errorMsg = error.message || 'Network error. Please check if the server is running.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Debug logging
  console.log('BlogEditor render - isEdit:', isEdit, 'id:', id, 'formData:', formData, 'error:', error);

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {isEdit ? `Edit Blog Post ${id ? `(ID: ${id})` : ''}` : 'Create New Blog Post'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/cms/dashboard')}
              className="px-4 py-2 bg-surface border border-white/20 rounded-lg text-white hover:bg-secondary transition"
            >
              <FaTimes className="inline mr-2" /> Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                // Trigger form submission
                const form = document.querySelector('form');
                if (form) {
                  // Create a submit event
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                } else {
                  // Fallback: call handleSubmit directly
                  handleSubmit(e);
                }
              }}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              <FaSave className="inline mr-2" /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white mb-2 font-medium">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="blog-post-slug"
                  required
                />
                {slugError && <p className="text-red-400 text-sm mt-1">{slugError}</p>}
                <p className="text-white/50 text-xs mt-1">URL-friendly version of the title</p>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="e.g., AI Trends, Machine Learning"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Read Time (minutes)</label>
                <input
                  type="number"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="8"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-white mb-2 font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent resize-none"
                placeholder="Short description of the blog post"
              />
            </div>

            <div className="mt-4">
              <label className="block text-white mb-2 font-medium">Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog post content here..."
              />
              <p className="text-white/50 text-xs mt-1">
                Full-featured rich text editor: Headings (H1-H6), Text sizes (small, normal, large, huge), 
                Bold, Italic, Underline, Strikethrough, Colors, Lists (ordered/bullet), Alignment, Links, 
                Images, Blockquotes, Code blocks. HTML content is fully supported and preserved.
              </p>
            </div>
          </div>

          {/* Media */}
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Featured Image"
                value={formData.image_url}
                onChange={(value) => setFormData({ ...formData, image_url: value })}
                placeholder="Upload featured image or paste URL"
              />

              <div>
                <label className="block text-white mb-2 font-medium">Author Name</label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="Author name"
                />
              </div>

              <ImageUpload
                label="Author Avatar"
                value={formData.author_avatar}
                onChange={(value) => setFormData({ ...formData, author_avatar: value })}
                placeholder="Upload author avatar or paste URL"
              />
            </div>
          </div>

          {/* SEO Plugin */}
          <SEOPlugin formData={formData} onUpdate={setFormData} />

          {/* SEO Settings */}
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  maxLength="60"
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="SEO title (recommended: 50-60 characters)"
                />
                <p className="text-white/50 text-xs mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows="3"
                  maxLength="160"
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent resize-none"
                  placeholder="SEO description (recommended: 150-160 characters)"
                />
                <p className="text-white/50 text-xs mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-white/50 text-xs mt-1">Comma-separated keywords</p>
              </div>

              <ImageUpload
                label="OG Image (Social Media)"
                value={formData.og_image}
                onChange={(value) => setFormData({ ...formData, og_image: value })}
                placeholder="Upload OG image or paste URL (1200x630px recommended)"
              />

              <div>
                <label className="block text-white mb-2 font-medium">Canonical URL</label>
                <input
                  type="url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                  placeholder="https://conbyt.com/blog/post-slug"
                />
                <p className="text-white/50 text-xs mt-1">Preferred URL for this content (optional)</p>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Publishing Options</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-primary/80 text-accent focus:ring-accent"
                />
                <span className="text-white font-medium">Publish this post</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-primary/80 text-accent focus:ring-accent"
                />
                <span className="text-white font-medium">Feature this post</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;

