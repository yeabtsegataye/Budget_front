import { create } from 'zustand';
import api from '../services/api';

const TOKEN_STORAGE_KEY = 'budget-app-token';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  token: null,

  init: async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    set({ token, loading: true });

    try {
      const data = await api.verifyToken();
      set({ user: data.user, token, loading: false });
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      set({ user: null, token: null, loading: false });
    }
  },

  signInWithGoogle: async () => {
    return { success: false, error: 'Google sign-in is not supported' };
  },

  signInWithEmail: async (email, password) => {
    try {
      const { token, user } = await api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user, token });
      return { success: true };
    } catch (error) {
      console.error('Email sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      const { token, user } = await api.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user, token });
      return { success: true };
    } catch (error) {
      console.error('Email sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  resetPassword: async () => {
    return { success: false, error: 'Password reset is not available' };
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ user: null, token: null });
    return { success: true };
  },

  refreshToken: async () => {
    return null;
  }
}));

// For compatibility with existing code
export const AuthProvider = ({ children }) => {
  return children;
};

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    loading: store.loading,
    token: store.token,
    init: store.init,
    signInWithGoogle: store.signInWithGoogle,
    signInWithEmail: store.signInWithEmail,
    signUpWithEmail: store.signUpWithEmail,
    resetPassword: store.resetPassword,
    logout: store.logout,
    refreshToken: store.refreshToken
  };
};

export default useAuthStore;