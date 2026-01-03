// Dashboard Layout - Protected Routes
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <DashboardHeader />
        <main className="flex-1 p-4 pb-20 md:p-6 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
