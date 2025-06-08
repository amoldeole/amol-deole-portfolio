export interface AdminMenuItem {
  name: string;
  path: string;
  icon: string;
}

export interface AdminSidebarProps {
  menuItems: AdminMenuItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}