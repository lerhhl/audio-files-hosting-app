import { JWTPayload } from "jose";
import { NextResponse } from "next/server";

export interface CreateSessionPayload {
  userId: number;
  username: string;
  isAdmin: boolean;
}

export interface SessionPayload extends CreateSessionPayload, JWTPayload {
  iat: number; // Issued at time in seconds
  exp: number; // Expiration time in seconds
}

export type SessionType = {
  userId?: number;
  username?: string;
  isAuth: boolean;
  isAdmin: boolean;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};

export type UpdateUserInput = {
  userId: number;
  newUsername?: string;
  newPassword?: string;
};

type CreateUserSuccessResponse = {
  message: string;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

type CreateUserErrorResponse = {
  error: {
    server?: string;
    username?: string[];
    password?: string[];
  };
};

export type CreateUserResponse =
  | CreateUserSuccessResponse
  | CreateUserErrorResponse;

export type CreateAudioFileInput = {
  description: string;
  category: string;
  mimeType: string;
  filePath: string;
  userId: number;
};

type GetUsersSuccessResponse = {
  items: Array<{
    id: number;
    username: string;
    isAdmin: boolean;
    createdAt: Date;
  }>;
  totalCount: number;
};

type GetUsersErrorResponse = {
  error: string;
};

export type GetUsersResponse = GetUsersSuccessResponse | GetUsersErrorResponse;

export type DeleteUserResponse = { message: string } | { error: string };

type UpdateUserSuccessResponse = {
  message: string;
};

type UpdateUserErrorResponse = {
  error: {
    username?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    server?: string;
  };
};

export type UpdateUserResponse =
  | UpdateUserSuccessResponse
  | UpdateUserErrorResponse;

type CreateAudioFileSuccessResponse = {
  message: string;
};

type CreateAudioFileErrorResponse = {
  error: {
    server?: string;
    description?: string[];
    file?: string[];
    category?: string[];
  };
};

export type CreateAudioFileResponse =
  | CreateAudioFileSuccessResponse
  | CreateAudioFileErrorResponse;

type GetAudioFilesSuccessResponse = {
  items: {
    id: number;
    filePath: string;
    description: string;
    category: string;
    mimeType: string;
    createdAt: Date;
  }[];
  totalCount: number;
};

type GetAudioFilesErrorResponse = {
  error: string;
};

export type GetAudioFilesResponse =
  | GetAudioFilesSuccessResponse
  | GetAudioFilesErrorResponse;

export type GetFileValidationSuccess = {
  filePath: string;
  fileType: string;
};

export type GetFileValidationError = {
  error: string;
  status: number;
};

export type GetFileValidationResult =
  | GetFileValidationSuccess
  | GetFileValidationError;

export type GetFileResponse = NextResponse<{ error: string }> | Response;
