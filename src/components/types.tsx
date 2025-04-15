"use client";

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
};

export type CreateUserFormErrors = {
  username?: string[];
  password?: string[];
  server?: string;
};

export type UpdateUserFormErrors = {
  username?: string[];
  currentPassword?: string[];
  newPassword?: string[];
  server?: string;
};

export type AudioFiles = {
  id: number;
  description: string;
  category: string;
  mimeType: string;
  createdAt: Date;
};

export type UploadVideoFormErrors = {
  description?: string[];
  category?: string[];
  file?: string[];
  server?: string;
};
