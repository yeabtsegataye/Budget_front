import useAuthStore from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthHeaders() {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config = {
      headers: { ...headers, ...options.headers },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || 'API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth
  async verifyToken() {
    return this.request('/auth/verify', { method: 'POST' });
  }

  // Transactions
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/transactions/${useAuthStore.getState().user.uid}?${queryString}`);
  }

  async createTransaction(transaction) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        uid: useAuthStore.getState().user.uid,
        ...transaction
      })
    });
  }

  async updateTransaction(id, transaction) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    });
  }

  async deleteTransaction(id) {
    return this.request(`/transactions/${id}`, { method: 'DELETE' });
  }

  async deleteAllTransactions() {
    return this.request(`/transactions/${useAuthStore.getState().user.uid}/all`, { method: 'DELETE' });
  }

  // Categories
  async getCategories() {
    return this.request(`/categories/${useAuthStore.getState().user.uid}`);
  }

  async createCategory(category) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({
        uid: useAuthStore.getState().user.uid,
        ...category
      })
    });
  }

  async updateCategory(id, category) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Stats
  async getStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/stats/${useAuthStore.getState().user.uid}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // User
  async getUser() {
    return this.request(`/user/${useAuthStore.getState().user.uid}`);
  }

  async updateUser(updates) {
    return this.request(`/user/${useAuthStore.getState().user.uid}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
}

export default new ApiService();