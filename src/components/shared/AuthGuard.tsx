'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login');
      } else if (requireAdmin && (session.user as any)?.role !== 'admin') {
        router.push('/dashboard/farmer');
      }
    }
  }, [session, isPending, router, requireAdmin]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#16503b]" />
        <p className="text-sm font-medium text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requireAdmin && (session.user as any)?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
