// ============================================
// Auth Protection Component
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
}

export function AuthProtectedLayout({ 
  children, 
  requiredRole 
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isAdmin, fetchUser } = useAuthStore();

  useEffect(() => {
    // Fetch user on mount to check authentication
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isLoading) return; // Still loading

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      router.push('/auth/login');
      return;
    }

    if (requiredRole === 'ADMIN' && !isAdmin) {
      // Requires admin but user is not admin
      router.push('/dashboard');
      return;
    }

    if (requiredRole === 'USER' && isAdmin) {
      // Only for regular users but user is admin - they can still access
      // Admin users have access to user pages
    }
  }, [isAuthenticated, isLoading, isAdmin, requiredRole, router]);

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render
  if (!isAuthenticated) {
    return null;
  }

  // If requires admin and user is not admin, don't render
  if (requiredRole === 'ADMIN' && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
