import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userId: number;
            name: string;
        };
    }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const secret = process.env.JWT_SECRET || "supersecret";
        const decoded = jwt.verify(token, secret) as { userId: number; name?: string };
        req.user = { userId: decoded.userId, name: decoded.name || "" };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}