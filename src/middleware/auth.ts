import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        name: string;
    }
}