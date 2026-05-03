import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Receipt, 
  Tag, 
  Settings, 
  Bell,
  DollarSign,
  TrendingUp,
  PieChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/categories', label: 'Categories', icon: Tag },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-background border-r border-border p-4 hidden lg:block">
      <nav className="space-y-2 mt-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;