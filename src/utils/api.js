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
  // In development, use localhost (server runs on port 5000)
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging (remove in production if needed)
if (typeof window !== 'undefined') {
  console.log('🔍 API Configuration:', {
    baseUrl: API_BASE_URL,
    isProduction: import.meta.env.PROD,
    viteApiUrl: import.meta.env.VITE_API_URL
  });
}

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
  const url = `${API_BASE_URL}/admin/auth/login`;
  console.log('🔍 Attempting login to:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    console.log('🔍 Login response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      console.error('🔍 Login error:', error);
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    console.log('✅ Login successful');
    return data;
  } catch (error) {
    console.error('🔍 Login fetch error:', error);
    throw error;
  }
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
  console.log('API: Fetching blog with ID:', id, 'URL:', `${API_BASE_URL}/admin/blogs/${id}`);
  
  const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('API: Response status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API: Error response:', errorText);
    throw new Error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('API: Blog data received:', data);
  return data;
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

// Clients API functions
export const fetchAdminClients = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch clients');
  return response.json();
};

export const fetchAdminClient = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch client');
  return response.json();
};

export const createAdminClient = async (clientData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }
  return response.json();
};

export const updateAdminClient = async (id, clientData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update client');
  }
  return response.json();
};

export const deleteAdminClient = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete client');
  return response.json();
};

// Projects API functions
export const fetchAdminProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const fetchAdminProject = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
};

export const createAdminProject = async (projectData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }
  return response.json();
};

export const updateAdminProject = async (id, projectData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }
  return response.json();
};

export const deleteAdminProject = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
};

// Milestones API functions
export const fetchAdminMilestones = async (projectId, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/milestones/project/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch milestones');
  return response.json();
};

export const fetchAdminMilestone = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch milestone');
  return response.json();
};

export const createAdminMilestone = async (milestoneData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/milestones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(milestoneData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create milestone');
  }
  return response.json();
};

export const updateAdminMilestone = async (id, milestoneData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(milestoneData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update milestone');
  }
  return response.json();
};

export const deleteAdminMilestone = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete milestone');
  return response.json();
};

// Payments API functions
export const fetchAdminPayments = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch payments');
  return response.json();
};

export const fetchAdminProjectPayments = async (projectId, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments/project/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch project payments');
  return response.json();
};

export const fetchAdminPayment = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch payment');
  return response.json();
};

export const createAdminPayment = async (paymentData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment');
  }
  return response.json();
};

export const updateAdminPayment = async (id, paymentData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update payment');
  }
  return response.json();
};

export const deleteAdminPayment = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete payment');
  return response.json();
};

// Portfolios API functions
export const fetchAdminPortfolios = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/portfolios`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch portfolios');
  return response.json();
};

export const fetchAdminPortfolio = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch portfolio');
  return response.json();
};

export const createAdminPortfolio = async (portfolioData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(portfolioData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create portfolio');
  }
  return response.json();
};

export const updateAdminPortfolio = async (id, portfolioData, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(portfolioData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update portfolio');
  }
  return response.json();
};

export const deleteAdminPortfolio = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete portfolio');
  return response.json();
};

