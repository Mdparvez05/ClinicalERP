import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  TestTube,
  CreditCard,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: FileText, label: 'OPD Rx', path: '/opd' },
    { icon: TestTube, label: 'Lab Tests', path: '/lab-tests' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];


  return (
    <aside
      className={`bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="relative p-4 border-b border-gray-800">
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-8 w-7 h-7 rounded-full bg-white text-gray-700 shadow flex items-center justify-center border border-gray-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">+</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">ClinicERP</h1>
              <p className="text-xs text-gray-400">Healthcare Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
          <Menu size={20} />
          {!collapsed && <span className="text-sm">Switch Role</span>}
        </button>
        <div className="mt-2 flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">DS</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
