class NotificationService {
  constructor() {
    this.permission = null;
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      this.permission = 'denied';
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const defaultOptions = {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  async scheduleNotification(title, options = {}, delay = 0) {
    setTimeout(() => {
      this.showNotification(title, options);
    }, delay);
  }

  // Test notification
  async testNotification() {
    return this.showNotification('Test Notification', {
      body: 'This is a test notification from Budget App',
      tag: 'test'
    });
  }
}

export default new NotificationService();