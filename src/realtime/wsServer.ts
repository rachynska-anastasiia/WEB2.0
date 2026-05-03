import type { Server } from "http";
import { WebSocketServer } from "ws";
import { verifyToken } from "../middleware/auth";
import { registerJobSocketClient } from "./pushHub";


export function attachJobWebSocket(server: Server) {
    const wss = new WebSocketServer({ noServer: true, path: "/websocket" });

    server.on("upgrade", (request, socket, head) => {
        const url = new URL(request.url || "", `http://${request.headers.host}`);
        
        if (url.pathname !== "/websocket") {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.destroy();
            return;
        }

        const token = url.searchParams.get("token");
        let user;
        if(token) user = verifyToken(token);
        if (!user) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            registerJobSocketClient(user.userId, ws);
            ws.send(JSON.stringify({
                channel: "jobs",
                type: "connected",
                at: new Date().toISOString(),
            }));
        });
    });

    return wss;
}
