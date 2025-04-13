"use client";

export interface CommonComponentProps {
  readonly isAuth: boolean;
  readonly isAdmin: boolean;
}

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
};

export type CreateUserFormState = {
  errors?: {
    username?: string[];
    password?: string[];
    server?: string;
  };
  message?: string;
  success?: boolean;
};

export type UpdateUserFormState = {
  errors?: {
    username?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    server?: string;
  };
  message?: string;
  success?: boolean;
};

export type AudioFiles = {
  id: number;
  description: string;
  category: string;
  mimeType: string;
  createdAt: Date;
};

export type UploadVideoFormState = {
  errors?: {
    description?: string[];
    category?: string[];
    file?: string[];
    server?: string;
  };
  message?: string;
  success?: boolean;
};
