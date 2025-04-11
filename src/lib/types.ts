export type SessionPayload = {
  userId: string;
  username: string;
  iat: number; // Issued at time in seconds
  exp: number; // Expiration time in seconds
};

export type SessionType = {
  userId?: string;
  isAuth: boolean;
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
