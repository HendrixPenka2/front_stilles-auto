// ============================================
// STILLES AUTO - API Client with Axios
// ============================================

import type {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  OtpVerifyRequest,
  Vehicle,
  VehicleFilters,
  VehicleFiltersOptions,
  VehicleAvailability,
  VehicleFormData,
  Accessory,
  AccessoryFilters,
  AccessoryFormData,
  Cart,
  CartItem,
  Order,
  Review,
  WishlistItem,
  Notification,
  AdminStats,
  StockMovement,
  StockMovementReason,
  ApiResponse,
  PaginatedResponse,
} from './types';
import { MOCK_USERS } from './mock-users';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (tokens: AuthTokens) => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
  }
  return { accessToken, refreshToken };
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Custom fetch wrapper with interceptors
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { accessToken: token } = getTokens();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try refresh token
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, await retryResponse.text());
      }
      return retryResponse.json();
    } else {
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new ApiError(401, 'Session expired');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }

  return response.json();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const tokens: AuthTokens = await response.json();
      setTokens(tokens);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// AUTH SERVICE (MOCK - Frontend Only)
// ============================================

// Generate mock tokens for demo
const generateMockTokens = (user: Omit<User, 'password'>): AuthTokens => {
  return {
    accessToken: `mock_token_${user.id}_${Date.now()}`,
    refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    expiresIn: 86400,
  };
};

// Store registered users in localStorage
const getRegisteredUsers = (): { [key: string]: any } => {
  if (typeof window === 'undefined') return MOCK_USERS;
  const stored = localStorage.getItem('registered_users');
  return stored ? JSON.parse(stored) : MOCK_USERS;
};

const saveRegisteredUsers = (users: { [key: string]: any }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('registered_users', JSON.stringify(users));
  }
};

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthTokens & { user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const users = getRegisteredUsers();
    const user = users[data.email];
    
    if (!user || user.password !== data.password) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;
    
    return {
      data: {
        ...generateMockTokens(userWithoutPassword),
        user: userWithoutPassword,
      },
    };
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ message: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getRegisteredUsers();
    
    if (users[data.email]) {
      throw new ApiError(400, 'Cet email existe déjà');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: undefined,
      role: 'USER' as const,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      password: data.password,
    };

    users[data.email] = newUser;
    saveRegisteredUsers(users);

    return {
      data: { message: 'Inscription réussie. Vérifiez votre email pour le code OTP.' },
    };
  },

  verifyOtp: async (data: OtpVerifyRequest): Promise<ApiResponse<AuthTokens & { user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getRegisteredUsers();
    const user = users[data.email];
    
    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé');
    }

    // For demo, any 6-digit code works
    if (!/^\d{6}$/.test(data.code)) {
      throw new ApiError(400, 'Code OTP invalide');
    }

    user.emailVerified = true;
    saveRegisteredUsers(users);

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return {
      data: {
        ...generateMockTokens(userWithoutPassword),
        user: userWithoutPassword,
      },
    };
  },

  resendOtp: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: { message: 'Code OTP renvoyé' },
    };
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: { message: 'Email de réinitialisation envoyé' },
    };
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: { message: 'Mot de passe réinitialisé' },
    };
  },

  me: async (): Promise<ApiResponse<User>> => {
    const { accessToken: token } = getTokens();
    if (!token) throw new ApiError(401, 'Non authentifié');
    
    // Retrieve user from token (simplified)
    const users = getRegisteredUsers();
    const user = Object.values(users).find((u: any) => 
      token.includes(u.id)
    ) as any;

    if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return { data: userWithoutPassword };
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { accessToken: token } = getTokens();
    if (!token) throw new ApiError(401, 'Non authentifié');
    
    const users = getRegisteredUsers();
    const user = Object.values(users).find((u: any) => 
      token.includes(u.id)
    ) as any;

    if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

    Object.assign(user, data);
    saveRegisteredUsers(users);

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return { data: userWithoutPassword };
  },

  logout: (): Promise<void> => {
    clearTokens();
    return Promise.resolve();
  },
};

// ============================================
// CATALOG SERVICE - VEHICLES
// ============================================
export const vehiclesApi = {
  getAll: (filters?: VehicleFilters, page = 1, limit = 12): Promise<PaginatedResponse<Vehicle>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetchWithAuth(`/vehicles?${params}`);
  },

  getFeatured: (): Promise<ApiResponse<Vehicle[]>> =>
    fetchWithAuth('/vehicles/featured'),

  getById: (id: string): Promise<ApiResponse<Vehicle>> =>
    fetchWithAuth(`/vehicles/${id}`),

  getFiltersOptions: (): Promise<ApiResponse<VehicleFiltersOptions>> =>
    fetchWithAuth('/vehicles/filters/options'),

  getAvailability: (id: string): Promise<ApiResponse<VehicleAvailability>> =>
    fetchWithAuth(`/vehicles/${id}/availability`),

  // Admin endpoints
  create: async (data: VehicleFormData): Promise<ApiResponse<Vehicle>> => {
    const payload = {
      ...data,
      features: JSON.stringify(data.features),
    };
    return fetchWithAuth('/admin/vehicles', { method: 'POST', body: JSON.stringify(payload) });
  },

  update: async (id: string, data: Partial<VehicleFormData>): Promise<ApiResponse<Vehicle>> => {
    const payload = {
      ...data,
      features: data.features ? JSON.stringify(data.features) : undefined,
    };
    return fetchWithAuth(`/admin/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/admin/vehicles/${id}`, { method: 'DELETE' }),

  uploadImages: async (id: string, files: File[]): Promise<ApiResponse<VehicleFormData>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const { accessToken: token } = getTokens();
    const response = await fetch(`${API_BASE_URL}/admin/vehicles/${id}/images`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  },

  reorderImages: (id: string, imageIds: string[]): Promise<ApiResponse<Vehicle>> =>
    fetchWithAuth(`/admin/vehicles/${id}/images/reorder`, { 
      method: 'PUT', 
      body: JSON.stringify({ imageIds }) 
    }),

  blockDates: (id: string, dates: string[], reason: string): Promise<ApiResponse<void>> =>
    fetchWithAuth(`/admin/vehicles/${id}/block-dates`, { 
      method: 'POST', 
      body: JSON.stringify({ dates, reason }) 
    }),
};

// ============================================
// CATALOG SERVICE - ACCESSORIES
// ============================================
export const accessoriesApi = {
  getAll: (filters?: AccessoryFilters, page = 1, limit = 12): Promise<PaginatedResponse<Accessory>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetchWithAuth(`/accessories?${params}`);
  },

  getById: (id: string): Promise<ApiResponse<Accessory>> =>
    fetchWithAuth(`/accessories/${id}`),

  getCategories: (): Promise<ApiResponse<string[]>> =>
    fetchWithAuth('/accessories/categories'),

  // Admin endpoints
  create: async (data: AccessoryFormData): Promise<ApiResponse<Accessory>> => {
    const payload = {
      ...data,
      specifications: JSON.stringify(data.specifications),
      compatibleVehicles: data.compatibleVehicles ? JSON.stringify(data.compatibleVehicles) : undefined,
    };
    return fetchWithAuth('/admin/accessories', { method: 'POST', body: JSON.stringify(payload) });
  },

  update: async (id: string, data: Partial<AccessoryFormData>): Promise<ApiResponse<Accessory>> => {
    const payload = {
      ...data,
      specifications: data.specifications ? JSON.stringify(data.specifications) : undefined,
      compatibleVehicles: data.compatibleVehicles ? JSON.stringify(data.compatibleVehicles) : undefined,
    };
    return fetchWithAuth(`/admin/accessories/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/admin/accessories/${id}`, { method: 'DELETE' }),

  adjustStock: (id: string, change: number, reason: StockMovementReason, note?: string): Promise<ApiResponse<Accessory>> =>
    fetchWithAuth(`/admin/accessories/${id}/stock`, { 
      method: 'POST', 
      body: JSON.stringify({ change, reason, note }) 
    }),

  getStockHistory: (id: string): Promise<ApiResponse<StockMovement[]>> =>
    fetchWithAuth(`/admin/accessories/${id}/stock-history`),
};

// ============================================
// CART SERVICE
// ============================================
export const cartApi = {
  get: (): Promise<ApiResponse<Cart>> =>
    fetchWithAuth('/cart'),

  addVehicleRental: (vehicleId: string, startDate: string, endDate: string): Promise<ApiResponse<Cart>> =>
    fetchWithAuth('/cart/rental', { 
      method: 'POST', 
      body: JSON.stringify({ vehicleId, startDate, endDate }) 
    }),

  addAccessory: (accessoryId: string, quantity = 1): Promise<ApiResponse<Cart>> =>
    fetchWithAuth('/cart/accessory', { 
      method: 'POST', 
      body: JSON.stringify({ accessoryId, quantity }) 
    }),

  updateItem: (itemId: string, data: Partial<CartItem>): Promise<ApiResponse<Cart>> =>
    fetchWithAuth(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(data) }),

  removeItem: (itemId: string): Promise<ApiResponse<Cart>> =>
    fetchWithAuth(`/cart/items/${itemId}`, { method: 'DELETE' }),

  clear: (): Promise<ApiResponse<void>> =>
    fetchWithAuth('/cart', { method: 'DELETE' }),
};

// ============================================
// ORDER SERVICE
// ============================================
export const ordersApi = {
  getMyOrders: (page = 1, limit = 10): Promise<PaginatedResponse<Order>> =>
    fetchWithAuth(`/orders/my?page=${page}&limit=${limit}`),

  getById: (id: string): Promise<ApiResponse<Order>> =>
    fetchWithAuth(`/orders/${id}`),

  create: (paymentMethod: string, notes?: string): Promise<ApiResponse<Order>> =>
    fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify({ paymentMethod, notes }) }),

  cancel: (id: string): Promise<ApiResponse<Order>> =>
    fetchWithAuth(`/orders/${id}/cancel`, { method: 'POST' }),

  // Admin
  getAllOrders: (page = 1, limit = 20): Promise<PaginatedResponse<Order>> =>
    fetchWithAuth(`/admin/orders?page=${page}&limit=${limit}`),

  updateStatus: (id: string, status: string): Promise<ApiResponse<Order>> =>
    fetchWithAuth(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ============================================
// COMMUNITY SERVICE - REVIEWS
// ============================================
export const reviewsApi = {
  getForVehicle: (vehicleId: string, page = 1): Promise<PaginatedResponse<Review>> =>
    fetchWithAuth(`/reviews/vehicle/${vehicleId}?page=${page}`),

  getForAccessory: (accessoryId: string, page = 1): Promise<PaginatedResponse<Review>> =>
    fetchWithAuth(`/reviews/accessory/${accessoryId}?page=${page}`),

  create: (data: { vehicleId?: string; accessoryId?: string; rating: number; comment: string }): Promise<ApiResponse<Review>> =>
    fetchWithAuth('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getPending: (page = 1): Promise<PaginatedResponse<Review>> =>
    fetchWithAuth(`/admin/reviews/pending?page=${page}`),

  approve: (id: string): Promise<ApiResponse<Review>> =>
    fetchWithAuth(`/admin/reviews/${id}/approve`, { method: 'POST' }),

  reject: (id: string, note: string): Promise<ApiResponse<Review>> =>
    fetchWithAuth(`/admin/reviews/${id}/reject`, { method: 'POST', body: JSON.stringify({ note }) }),
};

// ============================================
// COMMUNITY SERVICE - WISHLIST
// ============================================
export const wishlistApi = {
  getMyWishlist: (): Promise<ApiResponse<WishlistItem[]>> =>
    fetchWithAuth('/wishlist'),

  addVehicle: (vehicleId: string): Promise<ApiResponse<WishlistItem>> =>
    fetchWithAuth('/wishlist/vehicle', { method: 'POST', body: JSON.stringify({ vehicleId }) }),

  addAccessory: (accessoryId: string): Promise<ApiResponse<WishlistItem>> =>
    fetchWithAuth('/wishlist/accessory', { method: 'POST', body: JSON.stringify({ accessoryId }) }),

  remove: (id: string): Promise<void> =>
    fetchWithAuth(`/wishlist/${id}`, { method: 'DELETE' }),
};

// ============================================
// COMMUNICATION SERVICE
// ============================================
export const notificationsApi = {
  getMyNotifications: (): Promise<ApiResponse<Notification[]>> =>
    fetchWithAuth('/notifications'),

  markAsRead: (id: string): Promise<ApiResponse<Notification>> =>
    fetchWithAuth(`/notifications/${id}/read`, { method: 'POST' }),

  markAllAsRead: (): Promise<ApiResponse<void>> =>
    fetchWithAuth('/notifications/read-all', { method: 'POST' }),
};

export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }): Promise<ApiResponse<void>> =>
    fetchWithAuth('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================
// ADMIN SERVICE
// ============================================
export const adminApi = {
  getStats: (): Promise<ApiResponse<AdminStats>> =>
    fetchWithAuth('/admin/catalog/stats'),

  getAllUsers: (page = 1, limit = 20): Promise<PaginatedResponse<User>> =>
    fetchWithAuth(`/admin/users?page=${page}&limit=${limit}`),
};
