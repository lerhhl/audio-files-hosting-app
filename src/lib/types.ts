import { JWTPayload } from "jose";

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

export type LoginFormState =
  | {
      message?: string;
      success?: boolean;
    }
  | undefined;

export type UpdateUserInput = {
  userId: number;
  newUsername?: string;
  newPassword?: string;
};

export type CreateAudioFileInput = {
  description: string;
  category: string;
  mimeType: string;
  filePath: string;
  username: string;
};
