// src/mockApi.ts
import type { DashboardStats, LoginResponse } from './apiTypes';

const DB_DATA: DashboardStats = {
  totalUsers: 1500,
  subscriptions: {
    basic: 850,
    standard: 450,
    premium: 200
  }
};

export const loginUser = (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "password123") {
        resolve({
          success: true,
          token: "fake-jwt-token-xyz",
          user: { name: "Admin User" }
        });
      } else {
        reject("Invalid username or password");
      }
    }, 1000);
  });
};

export const fetchDashboardStats = (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DB_DATA);
    }, 800);
  });
};