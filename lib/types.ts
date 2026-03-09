// ============================================
// STILLES AUTO - Type Definitions
// ============================================

// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OtpVerifyRequest {
  email: string;
  code: string;
}

// Vehicle Types
export type VehicleStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'SOLD';
export type VehicleType = 'RENTAL' | 'SALE_ONLY' | 'BOTH';
export type TransmissionType = 'MANUAL' | 'AUTOMATIC';
export type FuelType = 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  status: VehicleStatus;
  type: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  mileage: number;
  color: string;
  pricePerDay?: number;
  salePrice?: number;
  stock: number;
  description: string;
  features: string[];
  images: VehicleImage[];
  rating: number;
  reviewCount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface VehicleFiltersOptions {
  brands: string[];
  models: Record<string, string[]>;
  years: number[];
  transmissions: TransmissionType[];
  fuelTypes: FuelType[];
  categories: string[];
  priceRange: { min: number; max: number };
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  type?: VehicleType;
  priceMin?: number;
  priceMax?: number;
  category?: string;
  search?: string;
}

export interface VehicleAvailability {
  vehicleId: string;
  unavailableDates: string[];
  maintenanceDates: string[];
}

// Accessory Types
export interface Accessory {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  compatibleVehicles?: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
}

export interface AccessoryFilters {
  category?: string;
  inStock?: boolean;
  priceMin?: number;
  priceMax?: number;
  compatibleVehicle?: string;
  search?: string;
}

// Cart Types
export type CartItemType = 'RENTAL' | 'PURCHASE';

export interface CartItem {
  id: string;
  type: CartItemType;
  vehicleId?: string;
  accessoryId?: string;
  vehicle?: Vehicle;
  accessory?: Accessory;
  quantity: number;
  startDate?: string;
  endDate?: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  vehicleId?: string;
  accessoryId?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  adminNote?: string;
  createdAt: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  userId: string;
  vehicleId?: string;
  accessoryId?: string;
  vehicle?: Vehicle;
  accessory?: Accessory;
  createdAt: string;
}

// Notification Types
export type NotificationType = 'ORDER' | 'RENTAL' | 'REVIEW' | 'SYSTEM' | 'PROMOTION';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Admin Stats Types
export interface AdminStats {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  maintenanceVehicles: number;
  totalAccessories: number;
  lowStockAccessories: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  stockValue: number;
}

// Stock Audit Types
export type StockMovementReason = 'PURCHASE' | 'SALE' | 'RETURN' | 'DAMAGE' | 'ADJUSTMENT' | 'LOSS';

export interface StockMovement {
  id: string;
  accessoryId: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: StockMovementReason;
  note?: string;
  createdBy: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form Types
export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  vin?: string;
  type: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  mileage: number;
  color: string;
  pricePerDay?: number;
  salePrice?: number;
  stock: number;
  description: string;
  features: string[];
  category: string;
}

export interface AccessoryFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  compatibleVehicles?: string[];
  specifications: Record<string, string>;
}
