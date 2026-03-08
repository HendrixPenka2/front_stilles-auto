// ============================================
// STILLES AUTO - Zustand State Management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Cart, CartItem, Notification, Vehicle, Accessory, WishlistItem } from './types';
import { authApi, cartApi, notificationsApi, wishlistApi, setTokens, clearTokens, getTokens } from './api';

// ============================================
// AUTH STORE
// ============================================
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,

      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        });
        set({
          user: response.data.user,
          isAuthenticated: true,
          isAdmin: response.data.user.role === 'ADMIN',
        });
      },

      register: async (data) => {
        await authApi.register(data);
      },

      verifyOtp: async (email, code) => {
        const response = await authApi.verifyOtp({ email, code });
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        });
        set({
          user: response.data.user,
          isAuthenticated: true,
          isAdmin: response.data.user.role === 'ADMIN',
        });
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      fetchUser: async () => {
        const { accessToken } = getTokens();
        if (!accessToken) {
          set({ isLoading: false });
          return;
        }
        try {
          const response = await authApi.me();
          set({
            user: response.data,
            isAuthenticated: true,
            isAdmin: response.data.role === 'ADMIN',
            isLoading: false,
          });
        } catch {
          clearTokens();
          set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
        }
      },

      updateUser: async (data) => {
        const response = await authApi.updateProfile(data);
        set({ user: response.data });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'ADMIN',
        });
      },
    }),
    {
      name: 'stilles-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================
// CART STORE
// ============================================
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  
  // Actions
  fetchCart: () => Promise<void>;
  addVehicleRental: (vehicleId: string, startDate: string, endDate: string) => Promise<void>;
  addAccessory: (accessoryId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, data: Partial<CartItem>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Local cart for non-authenticated users
  localCart: CartItem[];
  addToLocalCart: (item: CartItem) => void;
  removeFromLocalCart: (itemId: string) => void;
  clearLocalCart: () => void;
  syncLocalCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      itemCount: 0,
      localCart: [],

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await cartApi.get();
          set({
            cart: response.data,
            itemCount: response.data.items.length,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      addVehicleRental: async (vehicleId, startDate, endDate) => {
        try {
          const response = await cartApi.addVehicleRental(vehicleId, startDate, endDate);
          set({ cart: response.data, itemCount: response.data.items.length });
        } catch {
          const { localCart } = get();
          const days = Math.max(
            1,
            Math.ceil(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          const item: CartItem = {
            id: `local-rental-${vehicleId}-${Date.now()}`,
            type: 'RENTAL',
            vehicleId,
            quantity: 1,
            startDate,
            endDate,
            pricePerUnit: 0,
            totalPrice: 0,
          };
          set({ localCart: [...localCart, item], itemCount: localCart.length + 1 });
        }
      },

      addAccessory: async (accessoryId, quantity = 1) => {
        try {
          const response = await cartApi.addAccessory(accessoryId, quantity);
          set({ cart: response.data, itemCount: response.data.items.length });
        } catch {
          const { localCart } = get();
          const existing = localCart.find((item) => item.accessoryId === accessoryId && item.type === 'PURCHASE');
          if (existing) {
            const updated = localCart.map((item) =>
              item.id === existing.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalPrice: (item.quantity + quantity) * item.pricePerUnit,
                  }
                : item
            );
            set({ localCart: updated, itemCount: updated.length });
          } else {
            const item: CartItem = {
              id: `local-accessory-${accessoryId}-${Date.now()}`,
              type: 'PURCHASE',
              accessoryId,
              quantity,
              pricePerUnit: 0,
              totalPrice: 0,
            };
            set({ localCart: [...localCart, item], itemCount: localCart.length + 1 });
          }
        }
      },

      updateItem: async (itemId, data) => {
        try {
          const response = await cartApi.updateItem(itemId, data);
          set({ cart: response.data, itemCount: response.data.items.length });
        } catch {
          const { localCart } = get();
          const updated = localCart.map((item) => {
            if (item.id !== itemId) return item;
            const merged = { ...item, ...data };
            let totalPrice = merged.totalPrice;
            if (merged.type === 'RENTAL' && merged.startDate && merged.endDate) {
              const days = Math.max(
                1,
                Math.ceil(
                  (new Date(merged.endDate).getTime() - new Date(merged.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );
              totalPrice = days * merged.pricePerUnit;
            } else {
              const quantity = merged.quantity || 1;
              totalPrice = quantity * merged.pricePerUnit;
            }
            return { ...merged, totalPrice };
          });
          set({ localCart: updated, itemCount: updated.length });
        }
      },

      removeItem: async (itemId) => {
        try {
          const response = await cartApi.removeItem(itemId);
          set({ cart: response.data, itemCount: response.data.items.length });
        } catch {
          const { localCart } = get();
          const updated = localCart.filter((item) => item.id !== itemId);
          set({ localCart: updated, itemCount: updated.length });
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clear();
          set({ cart: null, itemCount: 0 });
        } catch {
          set({ localCart: [], cart: null, itemCount: 0 });
        }
      },

      // Local cart methods
      addToLocalCart: (item) => {
        const { localCart } = get();
        const existingIndex = localCart.findIndex((currentItem) => {
          if (item.type !== currentItem.type) return false;
          if (item.type === 'PURCHASE' && item.accessoryId && currentItem.accessoryId) {
            return item.accessoryId === currentItem.accessoryId;
          }
          if (item.type === 'PURCHASE' && item.vehicleId && currentItem.vehicleId) {
            return item.vehicleId === currentItem.vehicleId;
          }
          if (item.type === 'RENTAL' && item.vehicleId && currentItem.vehicleId) {
            return (
              item.vehicleId === currentItem.vehicleId &&
              item.startDate === currentItem.startDate &&
              item.endDate === currentItem.endDate
            );
          }
          return false;
        });
        
        if (existingIndex >= 0 && item.type === 'PURCHASE') {
          const updated = [...localCart];
          updated[existingIndex].quantity += item.quantity;
          updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].pricePerUnit;
          set({ localCart: updated, itemCount: updated.length });
        } else {
          set({ localCart: [...localCart, item], itemCount: localCart.length + 1 });
        }
      },

      removeFromLocalCart: (itemId) => {
        const { localCart } = get();
        const updated = localCart.filter((item) => item.id !== itemId);
        set({ localCart: updated, itemCount: updated.length });
      },

      clearLocalCart: () => {
        set({ localCart: [], itemCount: 0 });
      },

      syncLocalCart: async () => {
        const { localCart, clearLocalCart } = get();
        for (const item of localCart) {
          if (item.type === 'RENTAL' && item.vehicleId && item.startDate && item.endDate) {
            await cartApi.addVehicleRental(item.vehicleId, item.startDate, item.endDate);
          } else if (item.type === 'PURCHASE' && item.accessoryId) {
            await cartApi.addAccessory(item.accessoryId, item.quantity);
          }
        }
        clearLocalCart();
        await get().fetchCart();
      },
    }),
    {
      name: 'stilles-cart',
      partialize: (state) => ({ localCart: state.localCart }),
    }
  )
);

// ============================================
// NOTIFICATIONS STORE
// ============================================
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await notificationsApi.getMyNotifications();
      const unreadCount = response.data.filter((n) => !n.read).length;
      set({ notifications: response.data, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    await notificationsApi.markAsRead(id);
    const { notifications } = get();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    const unreadCount = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount });
  },

  markAllAsRead: async () => {
    await notificationsApi.markAllAsRead();
    const { notifications } = get();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },
}));

// ============================================
// WISHLIST STORE
// ============================================
interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  addAccessory: (accessory: Accessory) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (itemId: string, type: 'vehicle' | 'accessory') => boolean;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await wishlistApi.getMyWishlist();
      set({ items: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addVehicle: async (vehicle) => {
    try {
      const response = await wishlistApi.addVehicle(vehicle.id);
      set({ items: [...get().items, { ...response.data, vehicle }] });
    } catch {
      const mockItem: WishlistItem = {
        id: `local-wv-${Date.now()}`,
        userId: 'local-user',
        vehicleId: vehicle.id,
        vehicle,
        createdAt: new Date().toISOString(),
      };
      set({ items: [...get().items, mockItem] });
    }
  },

  addAccessory: async (accessory) => {
    try {
      const response = await wishlistApi.addAccessory(accessory.id);
      set({ items: [...get().items, { ...response.data, accessory }] });
    } catch {
      const mockItem: WishlistItem = {
        id: `local-wa-${Date.now()}`,
        userId: 'local-user',
        accessoryId: accessory.id,
        accessory,
        createdAt: new Date().toISOString(),
      };
      set({ items: [...get().items, mockItem] });
    }
  },

  removeItem: async (id) => {
    try {
      await wishlistApi.remove(id);
    } catch {
    }
    set({ items: get().items.filter((item) => item.id !== id) });
  },

  isInWishlist: (itemId, type) => {
    const { items } = get();
    return items.some((item) =>
      type === 'vehicle' ? item.vehicleId === itemId : item.accessoryId === itemId
    );
  },
}));

// ============================================
// UI STORE (Theme, Mobile Menu, etc.)
// ============================================
interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'system',

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileMenu: () => set({ mobileMenuOpen: !get().mobileMenuOpen }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'stilles-ui',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);
