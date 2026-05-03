import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../context/AuthContext';
import { Button } from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <nav className="bg-background border-b border-border px-4 py-3 hidden md:flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Budget App</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">{user.displayName || user.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;