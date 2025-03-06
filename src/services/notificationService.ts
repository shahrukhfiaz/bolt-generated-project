import { Website } from '../types';

/**
 * Request permission to show browser notifications
 * @returns Promise with the notification permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return 'denied';
  }

  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    return 'granted';
  }

  // Otherwise, request permission
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Show a notification for a website status change
 * @param website The website that changed status
 */
export const showWebsiteStatusNotification = (website: Website): void => {
  // Check if notifications are enabled
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Check if notifications are enabled in localStorage
  if (localStorage.getItem('notificationsEnabled') !== 'true') {
    return;
  }

  const hostname = new URL(website.url).hostname.replace('www.', '');
  
  // Create notification based on status
  if (website.status === 'down') {
    const notification = new Notification('Website Down Alert', {
      body: `${hostname} is currently down. Click to check details.`,
      icon: '/favicon.svg',
      tag: `website-down-${website.id}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.open(`/?website=${encodeURIComponent(website.url)}`, '_blank');
      notification.close();
    };
  } else if (website.status === 'up' && website.userReported) {
    // If the website was previously reported as down but is now up
    const notification = new Notification('Website Recovered', {
      body: `${hostname} is back online.`,
      icon: '/favicon.svg',
      tag: `website-up-${website.id}`
    });

    notification.onclick = () => {
      window.open(`/?website=${encodeURIComponent(website.url)}`, '_blank');
      notification.close();
    };
  }
};

/**
 * Set up notification listeners for website status changes
 */
export const setupNotifications = (): void => {
  // Check if notifications are supported and permission is granted
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  console.log('Setting up browser notifications for website status changes');

  // Store notification setup status in localStorage
  localStorage.setItem('notificationsEnabled', 'true');
  
  // Show a test notification
  setTimeout(() => {
    const testNotification = new Notification('Notifications Enabled', {
      body: 'You will now receive alerts when monitored websites go down.',
      icon: '/favicon.svg'
    });
    
    setTimeout(() => testNotification.close(), 5000);
  }, 1000);
};

/**
 * Disable notifications
 */
export const disableNotifications = (): void => {
  localStorage.setItem('notificationsEnabled', 'false');
  console.log('Browser notifications disabled');
};
