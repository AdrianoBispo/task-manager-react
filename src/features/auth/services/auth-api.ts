import { http } from '../../../services/http';
import type { AuthUser } from '../../../store/auth-store';
import { useAuthStore } from '../../../store/auth-store';

type AuthSession = {
  usuario: AuthUser;
  token: string;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
};

export type LoginPayload = {
  email: string;
  senha: string;
};

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const response = await http.post<AuthSession>('/api/auth/register', payload);

  useAuthStore.getState().setSession(response.data.token, response.data.usuario);

  return response.data;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await http.post<AuthSession>('/api/auth/login', payload);

  useAuthStore.getState().setSession(response.data.token, response.data.usuario);

  return response.data;
}

export function logout(): void {
  useAuthStore.getState().logout();
}