// ==========================================
// BASIC TYPESCRIPT CONCEPTS
// ==========================================

// Basic types
export type UserId = number;
export type Username = string;
export type Email = string;

// Union types (can be one of several types)
export type Status = 'active' | 'inactive' | 'pending';
export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

// Interface for objects (like a blueprint)
export interface User {
  id: UserId;
  username: Username;
  email: Email;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string; // Optional property (? means it might not exist)
}

// Interface for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Interface for error responses
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Function type definitions
export type Logger = (message: string, level?: 'info' | 'warn' | 'error') => void;
export type Validator<T> = (data: T) => boolean;

// Generic utility types
export interface DatabaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Example of extending interfaces
export interface Algorithm extends DatabaseEntity {
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'dynamic-programming';
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  implemented: boolean;
}