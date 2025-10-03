import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';

function Sidebar() {
  const { logout } = useSuperAdminAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/superadmin/dashboard' },
    { icon: <Building2 size={20} />, label: 'Organizations', to: '/superadmin/organizations' },
    { icon: <Users size={20} />, label: 'Admins', to: '/superadmin/admins' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-display font-bold text-sa-primary">QR Agent Admin</h1>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sa-primary text-white'
                  : 'text-sa-text-secondary hover:bg-sa-accent'
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
        className="absolute bottom-8 left-6 right-6 flex items-center px-4 py-2 text-sm font-medium text-sa-text-secondary hover:text-sa-primary transition-colors"
      >
        <LogOut size={20} />
        <span className="ml-3">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;