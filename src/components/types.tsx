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
