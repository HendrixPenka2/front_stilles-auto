// ============================================
// TEST DATA & FIXTURES - For Frontend Development
// ============================================

// Test OTP Codes (any 6-digit code works in frontend mode)
export const TEST_OTP_CODES = {
  VALID: '123456',
  EXPIRED: '999999',
  INVALID: '00000', // Less than 6 digits will be rejected
};

// Test Scenarios
export const TEST_SCENARIOS = {
  SCENARIO_1: {
    name: 'Login as Admin',
    steps: [
      'Go to /auth/login',
      'Enter: admin@stillesauto.com',
      'Enter: admin123',
      'Click "Se connecter"',
      'Expected: Redirect to /admin dashboard',
    ],
  },
  
  SCENARIO_2: {
    name: 'Login as User',
    steps: [
      'Go to /auth/login',
      'Enter: user@example.com',
      'Enter: password123',
      'Click "Se connecter"',
      'Expected: Redirect to /dashboard',
    ],
  },

  SCENARIO_3: {
    name: 'Register New User',
    steps: [
      'Go to /auth/register',
      'Enter unique email',
      'Enter password (min 6 chars)',
      'Confirm password',
      'Click "Créer mon compte"',
      'Enter any 6-digit code (e.g., 123456)',
      'Click "Vérifier"',
      'Expected: Redirect to /dashboard',
    ],
  },

  SCENARIO_4: {
    name: 'View Admin Dashboard',
    steps: [
      'Login as admin',
      'Navigate to /admin',
      'Expected: See dashboard with stats, vehicles, accessories, etc.',
    ],
  },

  SCENARIO_5: {
    name: 'View User Dashboard',
    steps: [
      'Login as user',
      'Navigate to /dashboard',
      'Expected: See user dashboard with profile, favorites, orders',
    ],
  },
};
