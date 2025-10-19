// API service for new portal system
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Common headers for authenticated requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API errors
const handleAPIError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};

// Portal Authentication API
export const portalAuthAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/portal/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/portal/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  verify: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/auth/verify`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token verification failed');
    }
    
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    return response.json();
  }
};

// Driver API
export const driverAPI = {
  getAssignments: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/assignments`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch assignments');
    }
    
    return response.json();
  },

  updateAssignmentStatus: async (assignmentId, status, notes) => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/assignments/${assignmentId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update assignment status');
    }
    
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch driver stats');
    }
    
    return response.json();
  },

  createRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create request');
    }
    
    return response.json();
  },

  getRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/requests`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }
    
    return response.json();
  },

  updateStatus: async (status) => {
    const response = await fetch(`${API_BASE_URL}/portal/driver/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update status');
    }
    
    return response.json();
  }
};

// Assistant API
export const assistantAPI = {
  getTickets: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/portal/assistant/tickets?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tickets');
    }
    
    return response.json();
  },

  assignTicket: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/tickets/${ticketId}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign ticket');
    }
    
    return response.json();
  },

  updateTicketStatus: async (ticketId, status, resolutionNotes) => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, resolution_notes: resolutionNotes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update ticket status');
    }
    
    return response.json();
  },

  createTicket: async (ticketData) => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create ticket');
    }
    
    return response.json();
  },

  getDriverRequests: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/portal/assistant/driver-requests?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch driver requests');
    }
    
    return response.json();
  },

  handleDriverRequest: async (requestId, status, resolutionNotes) => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/driver-requests/${requestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, resolution_notes: resolutionNotes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update driver request');
    }
    
    return response.json();
  },

  getInventory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/portal/assistant/inventory?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch inventory');
    }
    
    return response.json();
  },

  updateInventory: async (itemId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/inventory/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update inventory');
    }
    
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/portal/assistant/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch assistant stats');
    }
    
    return response.json();
  }
};

export { handleAPIError };