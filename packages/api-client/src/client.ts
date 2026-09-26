import type { ApiClientConfig } from './types';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function resolveImageUrl(path: string, assetBaseUrl?: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = assetBaseUrl?.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

async function readToken(
  value: string | null | Promise<string | null>
): Promise<string | null> {
  return value instanceof Promise ? value : value;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : '';
}

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, tokenStorage, assetBaseUrl } = config;
  const apiBase = baseUrl.replace(/\/$/, '');

  async function getTokens() {
    return {
      accessToken: await readToken(tokenStorage.getAccessToken()),
      refreshToken: await readToken(tokenStorage.getRefreshToken()),
    };
  }

  async function setTokens(accessToken: string, refreshToken: string) {
    await tokenStorage.setTokens(accessToken, refreshToken);
  }

  async function clearTokens() {
    await tokenStorage.clearTokens();
    if (config.userStorage) await config.userStorage.clearUser();
  }

  async function refreshAccessToken(): Promise<string | null> {
    const { refreshToken } = await getTokens();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${apiBase}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        await clearTokens();
        return null;
      }
      const data = await res.json();
      await setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      await clearTokens();
      return null;
    }
  }

  async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
    const { accessToken } = await getTokens();
    const headers: Record<string, string> = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(`${apiBase}${path}`, { ...options, headers });

    if (res.status === 401 && retry) {
      const newToken = await refreshAccessToken();
      if (newToken) return request<T>(path, options, false);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new ApiError(res.status, err.error ?? 'Request failed');
    }

    return res.json();
  }

  return {
    setTokens,
    clearTokens,
    resolveImageUrl: (path: string) => resolveImageUrl(path, assetBaseUrl),
    auth: {
      signup: (data: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role?: 'buyer' | 'seller';
        preferredLocalities?: string[];
        website?: string;
      }) => request<import('@updesh/shared-types').AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

      login: (identifier: string, password: string) =>
        request<import('@updesh/shared-types').AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
        }),

      me: () => request<{ user: import('@updesh/shared-types').User }>('/auth/me'),
    },

    localities: {
      list: () => request<{ localities: import('@updesh/shared-types').Locality[] }>('/localities'),
    },

    properties: {
      search: (filters: import('@updesh/shared-types').SearchFilters) =>
        request<import('@updesh/shared-types').PropertySearchResponse>(
          `/properties${buildQuery(filters as Record<string, string | number | undefined>)}`
        ),

      get: (id: string) => request<import('@updesh/shared-types').PropertyDetailResponse>(`/properties/${id}`),

      create: (data: Partial<import('@updesh/shared-types').Property>) =>
        request<{ property: import('@updesh/shared-types').Property }>('/properties', {
          method: 'POST',
          body: JSON.stringify(data),
        }),

      update: (id: string, data: Partial<import('@updesh/shared-types').Property>) =>
        request<{ property: import('@updesh/shared-types').Property }>(`/properties/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),

      delete: (id: string) => request<{ success: boolean }>(`/properties/${id}`, { method: 'DELETE' }),

      uploadImages: (id: string, files: File[] | import('./types.js').UploadFile[]) => {
        const form = new FormData();
        files.forEach((f) => {
          if (f instanceof File) {
            form.append('images', f);
          } else {
            form.append('images', { uri: f.uri, name: f.name, type: f.type } as unknown as Blob);
          }
        });
        return request<{ images: string[] }>(`/properties/${id}/images`, { method: 'POST', body: form });
      },
    },

    leads: {
      create: (data: {
        propertyId?: string;
        type: 'viewing_request' | 'call_request' | 'notify_me';
        name: string;
        phone: string;
        email?: string;
        message?: string;
        preferredTime?: string;
        filters?: Record<string, unknown>;
        website?: string;
      }) =>
        request<{ lead: { id: string; type: string; status: string } }>('/leads', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
    },

    users: {
      myLeads: () => request<{ leads: import('@updesh/shared-types').Lead[] }>('/users/me/leads'),
      myListings: () => request<import('@updesh/shared-types').SellerListingsResponse>('/users/me/listings'),
      mySaved: () => request<{ properties: import('@updesh/shared-types').Property[] }>('/users/me/saved'),
      toggleSaved: (propertyId: string) =>
        request<{ saved: boolean }>(`/users/me/saved/${propertyId}`, { method: 'POST' }),
      propertyLeads: () => request<{ leads: import('@updesh/shared-types').PropertyLead[] }>('/users/me/property-leads'),
    },

    admin: {
      dashboard: () => request<import('@updesh/shared-types').AdminDashboardStats>('/admin/dashboard'),
      users: (params?: { role?: string }) =>
        request<import('@updesh/shared-types').AdminUsersResponse>(
          `/admin/users${buildQuery(params ?? {})}`
        ),
      updateUserRole: (id: string, role: import('@updesh/shared-types').UserRole) =>
        request<{ user: import('@updesh/shared-types').AdminUser }>(`/admin/users/${id}/role`, {
          method: 'PATCH',
          body: JSON.stringify({ role }),
        }),
      allProperties: (params?: { status?: string; city?: string; sort?: string; limit?: number; cursor?: string }) =>
        request<import('@updesh/shared-types').AdminPropertiesResponse>(
          `/admin/properties${buildQuery(params ?? {})}`
        ),
      toggleFeatured: (id: string) =>
        request<{ property: import('@updesh/shared-types').Property }>(`/admin/properties/${id}/featured`, {
          method: 'PATCH',
        }),
      pendingListings: () => request<{ listings: import('@updesh/shared-types').Property[]; total: number }>('/admin/listings/pending'),
      updateListing: (id: string, action: 'approve' | 'reject', rejectionReason?: string) =>
        request<{ property: import('@updesh/shared-types').Property }>(`/admin/listings/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ action, rejectionReason }),
        }),
      leads: (params?: { status?: string; type?: string }) =>
        request<{ leads: import('@updesh/shared-types').Lead[]; total: number }>(
          `/admin/leads${buildQuery(params ?? {})}`
        ),
      reports: () => request<{ reports: unknown[]; message: string }>('/admin/reports'),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
