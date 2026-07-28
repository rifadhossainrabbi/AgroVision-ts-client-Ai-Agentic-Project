import {
  LayoutDashboard,
  Stethoscope,
  LineChart,
  Package,
  History,
  Bell,
  Settings,
  ShieldCheck,
  Users,
  ShoppingCart,
  ShoppingBag,
  ClipboardList,
  PlusCircle,
} from 'lucide-react';

export const DashboardNavConfig = {
  admin: [
    { title: 'Admin Dashboard', href: '/dashboard/admin', icon: ShieldCheck },
    { title: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { title: 'Manage Products', href: '/dashboard/admin/products', icon: Package },
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
      title: 'Add Products',
      href: '/dashboard/farmer/add-crop',
      icon: PlusCircle,
    },
    {
      title: 'My Products',
      href: '/dashboard/farmer/my-products',
      icon: Package,
    },
    {
      title: 'My Cart',
      href: '/dashboard/farmer/my-cart',
      icon: ShoppingCart,
    },
    {
      title: 'My Requests',
      href: '/dashboard/farmer/my-requests',
      icon: ShoppingBag,
    },
    {
      title: 'My Orders',
      href: '/dashboard/farmer/my-orders',
      icon: ClipboardList,
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
