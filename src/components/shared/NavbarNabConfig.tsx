export type UserRole = 'admin' | 'user';

export interface NavItem {
  title: string;
  href: string;
}

export const NavbarNavConfig: Record<string, NavItem[]> = {
  public: [
    { title: 'Home', href: '/' },
    { title: 'Explore Marketplace', href: '/marketplace' },
    { title: 'Resources', href: '/resources' },
    { title: 'Pricing', href: '/pricing' },
  ],
  user: [
    { title: 'Home', href: '/' },
    { title: 'Marketplace', href: '/marketplace' },
    { title: 'Add products', href: '/dashboard/farmer/add-crop' },
    { title: 'My Farm', href: '/dashboard/farmer' },
  ],
  admin: [
    { title: 'Home', href: '/' },
    { title: 'Admin Panel', href: '/dashboard/admin' },
    { title: 'Manage Users', href: '/dashboard/admin/users' },
    { title: 'Market Stats', href: '/dashboard/admin/stats' },
  ],
};
