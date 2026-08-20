export type AuthRole = 'COMMITTEE_LEAD' | 'TREASURER' | 'PRESIDENT' | 'IT_ADMIN';

export interface AuthSession {
  committeeId: string;
  role: AuthRole;
  name: string;
  isAdmin: boolean;
  exp: number;
  iat: number;
}

export interface LoginPayload {
  committeeId: string;
  pin: string;
}
