import {
  LayoutDashboard,
  Stethoscope,
  LineChart,
  Store,
  Package,
  History,
  Bell,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const DashboardNavConfig = {
  admin: [
    { title: 'Admin Dashboard', href: '/dashboard/admin', icon: ShieldCheck },
    { title: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { title: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  user: [
    { title: 'Dashboard', href: '/dashboard/farmer', icon: LayoutDashboard },
    {
      title: 'AI Crop Doctor',
      href: '/dashboard/farmer/crop-doctor',
      icon: Stethoscope,
    },
    {
      title: 'AI Farm Analyzer',
      href: '/dashboard/farmer/farm-analyzer',
      icon: LineChart,
    },
    {
      title: 'Marketplace',
      href: '/dashboard/farmer/marketplace',
      icon: Store,
    },
    {
      title: 'Add Products',
      href: '/dashboard/farmer/add-crop',
      icon: Package,
    },
    {
      title: 'My Products',
      href: '/dashboard/farmer/my-products',
      icon: Package,
    },
    {
      title: 'Diagnosis History',
      href: '/dashboard/farmer/history',
      icon: History,
    },
  ],
  system: [
    { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
};
