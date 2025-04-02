import { PublicUser } from "../user.types";

export interface RegisterResponse {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    server?: string;
  };
  success?: string;
}

export interface LoginResponse {
  errors?: {
    email?: string[];
    password?: string[];
    server?: string;
  };
  success?: {
    message: string;
    user: PublicUser;
  };
}
