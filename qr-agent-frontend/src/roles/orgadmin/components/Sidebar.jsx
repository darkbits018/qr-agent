import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Menu, Grid, LogOut } from 'lucide-react';
import { useOrgAdminAuth } from '../context/OrgAdminAuthContext';

function Sidebar() {
  const { logout } = useOrgAdminAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/orgadmin/dashboard' },
    { icon: <Menu size={20} />, label: 'Menu Items', to: '/orgadmin/menu-items' },
    { icon: <Grid size={20} />, label: 'Tables', to: '/orgadmin/tables' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-display font-bold text-oa-primary">Restaurant Manager</h1>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-oa-primary text-white'
                  : 'text-oa-text-secondary hover:bg-oa-accent'
              }`
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-8 left-6 right-6 flex items-center px-4 py-2 text-sm font-medium text-oa-text-secondary hover:text-oa-primary transition-colors"
      >
        <LogOut size={20} />
        <span className="ml-3">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;