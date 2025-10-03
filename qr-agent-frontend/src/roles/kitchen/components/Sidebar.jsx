import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Package, Book, Settings, LogOut } from 'lucide-react';
import { useKitchen } from '../context/KitchenContext';

function Sidebar() {
  const { logout } = useKitchen();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/kitchen/dashboard' },
    { icon: <ClipboardList size={20} />, label: 'Orders', to: '/kitchen/orders' },
    { icon: <Package size={20} />, label: 'Inventory', to: '/kitchen/inventory' },
    { icon: <Book size={20} />, label: 'Recipes', to: '/kitchen/recipes' },
    { icon: <Settings size={20} />, label: 'Settings', to: '/kitchen/settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-display font-bold text-kt-primary">Kitchen Dashboard</h1>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-kt-primary text-white'
                  : 'text-kt-text-secondary hover:bg-kt-accent'
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
        className="absolute bottom-8 left-6 right-6 flex items-center px-4 py-2 text-sm font-medium text-kt-text-secondary hover:text-kt-primary transition-colors"
      >
        <LogOut size={20} />
        <span className="ml-3">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;