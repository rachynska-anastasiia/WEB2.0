import { WebSocket } from "ws";

const socketsByUser = new Map<number, Set<WebSocket>>();

export function registerJobSocketClient(userId: number, ws: WebSocket): void {
    if (!socketsByUser.get(userId)) {
        socketsByUser.set(userId, new Set);
    }
    const userSockets = socketsByUser.get(userId);
    if (!userSockets) return;
    userSockets.add(ws);

    ws.on("close", () => {
        userSockets.delete(ws);
        if (userSockets.size === 0) {
            socketsByUser.delete(userId);
        }
    });
}

export function pushJsonToUser(userId: number, payload: unknown): void {
    const userSockets = socketsByUser.get(userId);
    if (!userSockets) return;

    userSockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        }
    });
}
