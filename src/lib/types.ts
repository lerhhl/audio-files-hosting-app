import { JWTPayload } from "jose";

export interface CreateSessionPayload {
  username: string;
  isAdmin: boolean;
}

export interface SessionPayload extends CreateSessionPayload, JWTPayload {
  iat: number; // Issued at time in seconds
  exp: number; // Expiration time in seconds
}

export type SessionType = {
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
