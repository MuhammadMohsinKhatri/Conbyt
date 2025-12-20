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

// Helper function to handle fetch requests with proper error handling
const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }
    
    // Parse JSON response
    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to server at ${url}. Please check if the server is running.`);
    }
    // Re-throw other errors
    throw error;
  }
};

export const fetchBlogs = async () => {
  return handleFetch(`${API_BASE_URL}/blogs`);
};

export const fetchBlogBySlug = async (slug) => {
  return handleFetch(`${API_BASE_URL}/blogs/${slug}`);
};

export const fetchPageContent = async (slug) => {
  return handleFetch(`${API_BASE_URL}/pages/${slug}`);
};

export const fetchCaseStudies = async () => {
  return handleFetch(`${API_BASE_URL}/portfolios`);
};

export const fetchCaseStudyBySlug = async (slug) => {
  return handleFetch(`${API_BASE_URL}/portfolios/${slug}`);
};

export const fetchTestimonials = async () => {
  return handleFetch(`${API_BASE_URL}/testimonials`);
};

export const fetchServices = async () => {
  return handleFetch(`${API_BASE_URL}/services`);
};

export const fetchStats = async () => {
  return handleFetch(`${API_BASE_URL}/stats`);
};

// Admin API functions
export const adminLogin = async (username, password) => {
  const url = `${API_BASE_URL}/admin/auth/login`;
  console.log('🔍 Attempting login to:', url);
  
  try {
    const data = await handleFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    console.log('✅ Login successful');
    return data;
  } catch (error) {
    console.error('🔍 Login error:', error);
    throw error;
  }
};

export const adminRegister = async (username, email, password, role) => {
  const url = `${API_BASE_URL}/admin/auth/register`;
  console.log('🔍 Attempting registration to:', url);
  
  try {
    const data = await handleFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, role })
    });
    console.log('✅ Registration successful');
    return data;
  } catch (error) {
    console.error('🔍 Registration error:', error);
    throw error;
  }
};

export const adminVerify = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminBlogs = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/blogs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminBlog = async (id, token) => {
  console.log('API: Fetching blog with ID:', id, 'URL:', `${API_BASE_URL}/admin/blogs/${id}`);
  try {
    const data = await handleFetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('API: Blog data received:', data);
    return data;
  } catch (error) {
    console.error('API: Error fetching blog:', error);
    throw error;
  }
};

export const createAdminBlog = async (blogData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  });
};

export const updateAdminBlog = async (id, blogData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  });
};

export const deleteAdminBlog = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminContact = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/contact`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteAdminContact = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/contact/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Clients API functions
export const fetchAdminClients = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/clients`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminClient = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/clients/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminClient = async (clientData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });
};

export const updateAdminClient = async (id, clientData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });
};

export const deleteAdminClient = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Projects API functions
export const fetchAdminProjects = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminProject = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminProject = async (projectData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
};

export const updateAdminProject = async (id, projectData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
};

export const deleteAdminProject = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Milestones API functions
export const fetchAdminMilestones = async (projectId, token) => {
  return handleFetch(`${API_BASE_URL}/admin/milestones/project/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminMilestone = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminMilestone = async (milestoneData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/milestones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(milestoneData)
  });
};

export const updateAdminMilestone = async (id, milestoneData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(milestoneData)
  });
};

export const deleteAdminMilestone = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/milestones/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Payments API functions
export const fetchAdminPayments = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminProjectPayments = async (projectId, token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments/project/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminPayment = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminPayment = async (paymentData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
};

export const updateAdminPayment = async (id, paymentData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });
};

export const deleteAdminPayment = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Portfolios API functions
export const fetchAdminPortfolios = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/portfolios`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminPortfolio = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminPortfolio = async (portfolioData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(portfolioData)
  });
};

export const updateAdminPortfolio = async (id, portfolioData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(portfolioData)
  });
};

export const deleteAdminPortfolio = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/portfolios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Tasks API functions
export const fetchAdminTasks = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminTask = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createAdminTask = async (taskData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
};

export const updateAdminTask = async (id, taskData, token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
};

export const deleteAdminTask = async (id, token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchAdminUsers = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/tasks/users/list`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// User Management API functions (admin only)
export const fetchAllAdminUsers = async (token) => {
  return handleFetch(`${API_BASE_URL}/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateAdminUserRole = async (userId, role, token) => {
  return handleFetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });
};

export const updateUserPermissions = async (userId, permissions, token) => {
  return handleFetch(`${API_BASE_URL}/admin/users/${userId}/permissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ permissions })
  });
};

export const deleteUserSectionPermissions = async (userId, section, token) => {
  return handleFetch(`${API_BASE_URL}/admin/users/${userId}/permissions/${section}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

