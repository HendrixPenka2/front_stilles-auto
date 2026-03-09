// ============================================
// MOCK USERS - Pour le développement sans backend
// ============================================

import type { User } from './types';

// Comptes prédéfinis
export const MOCK_USERS: { [key: string]: User & { password: string } } = {
  'user@example.com': {
    id: 'user-001',
    email: 'user@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '600000000',
    avatar: undefined,
    role: 'USER',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    password: 'password123',
  },
  'admin@stillesauto.com': {
    id: 'admin-001',
    email: 'admin@stillesauto.com',
    firstName: 'Admin',
    lastName: 'Stilles Auto',
    phone: '611111111',
    avatar: undefined,
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    password: 'admin123',
  },
};

export const CREDENTIALS = {
  USER: {
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Jean',
    lastName: 'Dupont',
  },
  ADMIN: {
    email: 'admin@stillesauto.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Stilles Auto',
  },
};
