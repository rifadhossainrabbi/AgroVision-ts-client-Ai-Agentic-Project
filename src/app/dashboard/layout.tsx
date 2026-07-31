import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { auth } from '@/lib/auth'; // Better Auth server-side check
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import AuthGuard from '@/components/shared/AuthGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  // ইউজার রোল ডেটাবেস থেকে আসছে (admin/user)
  const role = session.user.role as 'admin' | 'user';

  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row bg-[#f8faf9] dark:bg-gray-950 min-h-screen">
        <DashboardSidebar role={role} />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
