import { getWebSocketUrl } from "../api/client";
import type { JobSocketMessage } from "../api/jobs";

export type WebSocketConnectionState = "idle" | "connecting" | "open" | "reconnecting"  | "offline" | "error";
 
type WebSocketClientOptions = {
  onStateChange?: (state: WebSocketConnectionState) => void;
  onRawMessage?: (data: unknown) => void;
  onError?: (error: Error) => void;
  maxReconnectAttempts?: number;
  baseReconnectDelayMs?: number;
  maxReconnectDelayMs?: number;
};

type Unsubscribe = () => void;

function isJobSocketMessage(value: unknown): value is JobSocketMessage {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;

  return (
    v.channel === "jobs" &&
    typeof v.type === "string" &&
    typeof v.at === "string"
  );
}

export class JobsWebSocketClient {
  private ws: WebSocket | null = null;
  private state: WebSocketConnectionState = "idle";
  private listeners = new Set<(msg: JobSocketMessage) => void>();
  private readonly options: WebSocketClientOptions;

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private shouldReconnect = false;

  private readonly maxReconnectAttempts: number;
  private readonly baseReconnectDelayMs: number;
  private readonly maxReconnectDelayMs: number;

  constructor(options: WebSocketClientOptions = {}) {
    this.options = options;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.baseReconnectDelayMs = options.baseReconnectDelayMs ?? 500;
    this.maxReconnectDelayMs = options.maxReconnectDelayMs ?? 8000;
  }

  subscribe(listener: (msg: JobSocketMessage) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  connect(): void {
    this.shouldReconnect = true;

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    )  return;

    this.openSocket();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setState("offline");
  }

  private openSocket(): void {
    const url = getWebSocketUrl();

    if (!url) {
      this.handleError("No token for WebSocket connection");
      this.setState("offline");
      return;
    }

    this.setState(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");

    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;

      this.reconnectAttempts = 0;
      this.setState("open");
    };

    ws.onmessage = ({ data }) => {
      if (this.ws !== ws) return;

      try {
        const parsed = JSON.parse(String(data));
        this.options.onRawMessage?.(parsed);

        if (isJobSocketMessage(parsed)) {
          this.listeners.forEach((listener) => listener(parsed));
        }
      } catch {
        this.handleError("Failed to parse WebSocket message", data);
      }
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;

      this.handleError("WebSocket error");
      ws.close();
    };

    ws.onclose = () => {
      if (this.ws !== ws) return;

      this.ws = null;

      if (this.shouldReconnect) {
        this.scheduleReconnect();
      } else {
        this.setState("offline");
      }
    };
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState("offline");
      return;
    }

    this.reconnectAttempts += 1;
    this.setState("reconnecting");

    const exponentialDelay = Math.min(
      this.baseReconnectDelayMs * 2 ** (this.reconnectAttempts - 1),
      this.maxReconnectDelayMs,
    );

    const jitter = Math.floor(Math.random() * 300);
    const delay = exponentialDelay + jitter;

    this.clearReconnectTimer();

    this.reconnectTimer = setTimeout(() => {
      this.openSocket();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (!this.reconnectTimer) return;

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  private setState(next: WebSocketConnectionState): void {
    if (this.state === next) return;

    this.state = next;
    this.options.onStateChange?.(next);
  }

  private handleError(message: string, raw?: unknown): void {
    this.setState("error");
    this.options.onError?.(new Error(message));

    if (raw) {
      this.options.onRawMessage?.(raw);
    }
  }
}