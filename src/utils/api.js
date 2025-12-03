const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchBlogs = async () => {
  const response = await fetch(`${API_BASE_URL}/blogs`);
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

export const fetchBlogBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch blog');
  return response.json();
};

export const fetchCaseStudies = async () => {
  const response = await fetch(`${API_BASE_URL}/case-studies`);
  if (!response.ok) throw new Error('Failed to fetch case studies');
  return response.json();
};

export const fetchTestimonials = async () => {
  const response = await fetch(`${API_BASE_URL}/testimonials`);
  if (!response.ok) throw new Error('Failed to fetch testimonials');
  return response.json();
};

export const fetchServices = async () => {
  const response = await fetch(`${API_BASE_URL}/services`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

