import { apiGet, apiPost, saveToken } from "./client";

export type LoginResponse = {
  token: string;
};

export type UserRow = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export async function registerUser(name: string, email: string): Promise<UserRow> {
  return apiPost<UserRow>("/users/AddUser", { name, email });
}

export async function loginUser(email: string): Promise<LoginResponse> {
  const result = await apiGet<LoginResponse>(`/users/Login/${encodeURIComponent(email)}`);
  saveToken(result.token);
  return result;
}