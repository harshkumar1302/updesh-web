import { createApiClient } from '@updesh/api-client';

export const webTokenStorage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

export const webUserStorage = {
  getUser: () => localStorage.getItem('user'),
  setUser: (json: string) => localStorage.setItem('user', json),
  clearUser: () => localStorage.removeItem('user'),
};

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

export const api = createApiClient({
  baseUrl: apiUrl,
  tokenStorage: webTokenStorage,
  userStorage: webUserStorage,
});

export const { setTokens, clearTokens } = api;
export { ApiError } from '@updesh/api-client';
