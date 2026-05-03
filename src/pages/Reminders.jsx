import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Select, SelectItem } from '../components/ui/Select';
import notificationService from '../services/notifications';
import api from '../services/api';
import toast from 'react-hot-toast';

const Reminders = () => {
  const [settings, setSettings] = useState({
    enabled: false,
    time: '09:00',
    frequency: 'daily',
    dayOfWeek: 1,
    dayOfMonth: 1,
    message: 'Time to check your budget!',
    soundEnabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    notificationService.requestPermission();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getUser();
      if (data.reminderSettings) {
        setSettings(data.reminderSettings);
      }
    } catch (error) {
      console.error('Error fetching reminder settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.updateUser({ reminderSettings: settings });
      toast.success('Reminder settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleTestNotification = async () => {
    await notificationService.testNotification();
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return <div className="animate-pulse">Loading reminders...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Reminders</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Budget Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Enable Reminders</label>
              <p className="text-sm text-muted-foreground">Receive periodic budget check reminders</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          {settings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => updateSetting('time', e.target.value)}
                  className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) => updateSetting('frequency', value)}
                >
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </Select>
              </div>

              {settings.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Day of Week</label>
                  <Select
                    value={settings.dayOfWeek.toString()}
                    onValueChange={(value) => updateSetting('dayOfWeek', parseInt(value))}
                  >
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </Select>
                </div>
              )}

              {settings.frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Day of Month</label>
                  <Select
                    value={settings.dayOfMonth.toString()}
                    onValueChange={(value) => updateSetting('dayOfMonth', parseInt(value))}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={settings.message}
                  onChange={(e) => updateSetting('message', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={3}
                  placeholder="Enter reminder message"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Sound</label>
                  <p className="text-sm text-muted-foreground">Play sound with notifications</p>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-4 h-4" />
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Settings</Button>
                <Button variant="outline" onClick={handleTestNotification}>
                  Test Notification
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Reminders;