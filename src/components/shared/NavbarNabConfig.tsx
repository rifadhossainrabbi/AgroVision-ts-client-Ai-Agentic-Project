export type UserRole = 'admin' | 'user';

export interface NavItem {
  title: string;
  href: string;
}

export const NavbarNavConfig: Record<string, NavItem[]> = {
  public: [
    { title: 'Home', href: '/' },
    { title: 'Marketplace', href: '/marketplace' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Blog', href: '/blog' },
  ],
  user: [
    { title: 'Home', href: '/' },
    { title: 'Marketplace', href: '/marketplace' },
    { title: 'Add products', href: '/dashboard/farmer/add-crop' },
    { title: 'My Farm', href: '/dashboard/farmer' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ],
  admin: [
    { title: 'Home', href: '/' },
    { title: 'Marketplace', href: '/marketplace' },
    { title: 'User Management', href: '/dashboard/admin/users' },
    { title: 'Product Management', href: '/dashboard/admin/products' },
    { title: 'Admin Panel', href: '/dashboard/admin' },
  ],
};
