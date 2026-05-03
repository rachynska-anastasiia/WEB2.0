import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userId: number;
        };
    }
}

export function verifyToken(token: string): { userId: number } | null {
    try {
        const secret = process.env.JWT_SECRET || "supersecret";
        const decoded = jwt.verify(token, secret) as { userId: number};
        return decoded;
    } catch {
        return null;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { userId: decoded.userId};
    next();
}