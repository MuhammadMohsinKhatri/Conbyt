// API Base URL - uses environment variable or defaults to relative path for production
// In development, use localhost. In production, use relative path (same domain)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production (same domain), use relative path
  if (import.meta.env.PROD) {
    return '/api';
  }
  // In development, use localhost
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

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

// Admin API functions
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
};

export const adminVerify = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Token verification failed');
  return response.json();
};

export const fetchAdminBlogs = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

export const fetchAdminBlog = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch blog');
  return response.json();
};

export const createAdminBlog = async (blogData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create blog');
  }
  return response.json();
};

export const updateAdminBlog = async (id, blogData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update blog');
  }
  return response.json();
};

export const deleteAdminBlog = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete blog');
  return response.json();
};

export const fetchAdminContact = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/contact`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch contact submissions');
  return response.json();
};

export const deleteAdminContact = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/contact/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete contact submission');
  return response.json();
};

