import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Zap, Bell, X, Star, ShoppingBag } from 'lucide-react';

export type NotificationType = 'sale' | 'release' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (title: string, message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Mock data for simulation
const MOCK_ALERTS = [
  { title: "Flash Sale!", message: "Cyber Flow 2077 is 50% OFF for the next hour.", type: 'sale' },
  { title: "New Release", message: "Void Scrappers is now available in the store.", type: 'release' },
  { title: "Wishlist Alert", message: "Neon Drifter has a price drop.", type: 'sale' },
  { title: "System Update", message: "Nexus OS v4.2.1 installed successfully.", type: 'system' }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((title: string, message: string, type: NotificationType = 'system') => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { id, title, message, type };
    
    setNotifications(prev => [newNotif, ...prev]);

    // Auto dismiss
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate random notifications for the prototype
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to trigger a notification every 15 seconds
      if (Math.random() > 0.7) {
        const randomAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
        addNotification(randomAlert.title, randomAlert.message, randomAlert.type as NotificationType);
      }
    }, 15000);

    // Trigger one immediately on mount after a delay
    const initialTimer = setTimeout(() => {
        addNotification("Welcome Back", "Nexus Play connection established.", "system");
    }, 2000);

    return () => {
        clearInterval(interval);
        clearTimeout(initialTimer);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      
      {/* Notification Container - Positioned absolutely within the relative parent (Phone Screen) */}
      <div className="absolute top-12 left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto w-full max-w-sm animate-fade-in-up"
          >
            <NotificationItem 
              notification={notif} 
              onClose={() => removeNotification(notif.id)} 
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'sale': return <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />;
      case 'release': return <Star className="w-5 h-5 text-nexus-cyan fill-nexus-cyan/20" />;
      case 'system': return <Bell className="w-5 h-5 text-gray-400" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'sale': return 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      case 'release': return 'border-nexus-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]';
      default: return 'border-white/10';
    }
  };

  return (
    <div className={`relative overflow-hidden bg-black/80 backdrop-blur-xl border ${getBorderColor()} rounded-xl p-3 shadow-2xl flex items-start gap-3 transition-all duration-300`}>
      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full">
         <div className="h-full bg-current w-full origin-left animate-[shimmer_5s_linear_forwards]" style={{ color: notification.type === 'sale' ? '#FACC15' : '#00FFFF' }}></div>
      </div>

      <div className="mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white leading-tight mb-0.5 flex items-center justify-between">
            {notification.title}
        </h4>
        <p className="text-xs text-gray-300 leading-snug">{notification.message}</p>
      </div>

      <button 
        onClick={onClose}
        className="text-gray-500 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
