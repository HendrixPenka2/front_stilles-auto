// ============================================
// Test Credentials Display Component
// ============================================

'use client';

import { useEffect } from 'react';
import { CREDENTIALS } from '@/lib/mock-users';

export function TestCredentialsDisplay() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('%c=== STILLES AUTO - TEST CREDENTIALS (Frontend Only) ===', 'color: #0066cc; font-size: 14px; font-weight: bold;');
      console.log('%cCompte User:\n  Email: ' + CREDENTIALS.USER.email + '\n  Password: ' + CREDENTIALS.USER.password, 'color: #228B22; font-size: 12px;');
      console.log('%cCompte Admin:\n  Email: ' + CREDENTIALS.ADMIN.email + '\n  Password: ' + CREDENTIALS.ADMIN.password, 'color: #DC143C; font-size: 12px;');
      console.log('%cOu créez un nouveau compte via /auth/register\nCode OTP: N\'importe quel code à 6 chiffres (ex: 123456)', 'color: #FF8C00; font-size: 12px;');
      console.log('%c====================================================', 'color: #0066cc; font-size: 14px; font-weight: bold;');
    }
  }, []);

  return null;
}
