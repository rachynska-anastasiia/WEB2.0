import { getWebSocketUrl } from "../api/client";
import type { JobSocketMessage } from "../api/jobs";

type WebSocketConnectionState = "idle" | "connecting" | "open" | "closed" | "error";
type WebSocketClientOptions = {
  onStateChange?: (state: WebSocketConnectionState) => void;
  onRawMessage?: (data: unknown) => void;
  onError?: (error: Error) => void;
};
type Unsubscribe = () => void;

function isJobSocketMessage(value: unknown): value is JobSocketMessage {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.channel === "jobs" && typeof v.type === "string" && typeof v.at === "string";
}

export class JobsWebSocketClient {
  private ws: WebSocket | null = null;
  private state: WebSocketConnectionState = "idle";
  private readonly listeners = new Set<(msg: JobSocketMessage) => void>();
  private readonly options: WebSocketClientOptions;

  constructor(options: WebSocketClientOptions = {}) {
    this.options = options;
  }

  subscribe(listener: (msg: JobSocketMessage) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  connect(): void {
    if (this.ws?.readyState <= WebSocket.OPEN) return;

    const url = getWebSocketUrl();
    if (!url) return this.handleError("No token");

    this.setState("connecting");
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => this.ws === ws && this.setState("open");
    ws.onclose = () => this.ws === ws && (this.ws = null, this.setState("closed"));
    ws.onerror = () => this.ws === ws && this.handleError("WebSocket error");
    
    ws.onmessage = ({ data }) => {
      if (this.ws !== ws) return;
      try {
        const parsed = JSON.parse(String(data));
        this.options.onRawMessage?.(parsed);
        
        if (isJobSocketMessage(parsed)) this.listeners.forEach((l) => l(parsed));
      } catch {
        this.handleError("Parse error", data);
      }
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.setState("closed");
  }

  private setState(next: WebSocketConnectionState) {
    if (this.state === next) return;
    this.options.onStateChange?.(this.state = next);
  }

  private handleError(msg: string, raw?: unknown) {
    this.setState("error");
    this.options.onError?.(new Error(msg));
    if (raw) this.options.onRawMessage?.(raw);
  }
}