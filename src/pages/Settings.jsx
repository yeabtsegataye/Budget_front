import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Download, Trash2, Moon, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Select, SelectItem } from '../components/ui/Select';
import { useTheme } from '../context/ThemeContext';
import useAuthStore from '../context/AuthContext';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import api from '../services/api';
import { exportToCSV, exportToJSON } from '../utils/formatters';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const data = await api.getUser();
      setUserSettings(data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (currency) => {
    try {
      await api.updateUser({ currency });
      setUserSettings({ ...userSettings, currency });
      toast.success('Currency updated');
    } catch (error) {
      toast.error('Failed to update currency');
    }
  };

  const handleThemeChange = async () => {
    toggleTheme();
    try {
      await api.updateUser({ theme: theme === 'light' ? 'dark' : 'light' });
      setUserSettings({ ...userSettings, theme: theme === 'light' ? 'dark' : 'light' });
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const handleExportData = async () => {
    try {
      const transactions = await api.getTransactions({ limit: 1000 });
      const categories = await api.getCategories();
      
      const exportData = {
        transactions: transactions.transactions,
        categories,
        user: userSettings,
        exportedAt: new Date().toISOString()
      };
      
      exportToJSON(exportData, 'budget-data.json');
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAllData = async () => {
    try {
      await api.deleteAllTransactions();
      toast.success('All data deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete data');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading settings...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{user.displayName || user.email}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Currency</label>
                <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
              </div>
              <Select
                value={userSettings.currency}
                onValueChange={handleCurrencyChange}
              >
                <SelectItem value="ETB">ETB</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <Switch
                  checked={userSettings.theme === 'dark'}
                  onCheckedChange={handleThemeChange}
                />
                <Moon className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Export Data</label>
                <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-red-600">Delete All Data</label>
                <p className="text-sm text-muted-foreground">Permanently delete all transactions and categories</p>
              </div>
              <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0 • Budget Web App
            </p>
          </CardContent>
        </Card>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAllData}
        title="Delete All Data"
        message="Are you sure you want to delete all your transactions and categories? This action cannot be undone."
      />
    </motion.div>
  );
};

export default Settings;