// src/types.ts

export interface SubscriptionData {
  basic: number;
  standard: number;
  premium: number;
}

export interface DashboardStats {
  totalUsers: number;
  subscriptions: SubscriptionData;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    name: string;
  };
}

// Prop types for components that control authentication
export interface AuthProps {
  setAuth: (isAuthenticated: boolean) => void;
}