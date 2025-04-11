import { JWTPayload } from "jose";

export interface CreateSessionPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export interface SessionPayload extends CreateSessionPayload, JWTPayload {
  iat: number; // Issued at time in seconds
  exp: number; // Expiration time in seconds
}

export type SessionType = {
  userId?: string;
  isAuth: boolean;
  isAdmin: boolean;
};

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
