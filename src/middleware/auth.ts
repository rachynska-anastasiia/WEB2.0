import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userId: number;
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
        const decoded = jwt.verify(token, secret) as { userId: number};
        req.user = { userId: decoded.userId};
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}