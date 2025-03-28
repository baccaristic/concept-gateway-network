
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

// Define the notification type
export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  link?: string;
  userId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  connected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (!user) {
      setConnected(false);
      return;
    }

    const client = new Client({
      // Use SockJS as the WebSocket client
      webSocketFactory: () => new SockJS("http://localhost:8083/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      debug: function(str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    client.onConnect = () => {
      setConnected(true);
      console.log("Connected to WebSocket");
      
      // Subscribe to user-specific notifications
      client.subscribe(`/user/${user.id}/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          setNotifications(prev => [notification, ...prev]);
          
          // Show toast for new notification
          toast({
            title: notification.type,
            description: notification.message,
            icon: <Bell className="h-4 w-4" />
          });
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      });
      
      // Subscribe to global notifications if needed
      client.subscribe("/topic/global-notifications", (message) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          setNotifications(prev => [notification, ...prev]);
          
          toast({
            title: "New Notification",
            description: notification.message,
            icon: <Bell className="h-4 w-4" />
          });
        } catch (error) {
          console.error("Error parsing global notification:", error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers, frame.body);
      setConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to notification service",
        variant: "destructive"
      });
    };

    // Connect the client
    client.activate();

    // Clean up on unmount
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user, toast]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      connected 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
