const API_BASE_URL = "http://localhost:3000";

export type ApiError = {
  success?: false;
  error?: string;
  message?: string;
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function isAuthorized(): boolean {
  return Boolean(getToken());
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errorData = data as ApiError | null;
    throw new Error(errorData?.error || errorData?.message || "Request failed");
  }

  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}

export function getWebSocketUrl(): string | null {
  const token = getToken();
  if (!token) return null;

  const baseUrl = new URL(API_BASE_URL);
  baseUrl.protocol = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  baseUrl.pathname = "/websocket";
  baseUrl.searchParams.set("token", token);

  return baseUrl.toString();
}