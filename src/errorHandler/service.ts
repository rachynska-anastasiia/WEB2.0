import { Request, Response, NextFunction } from "express";
import { error } from "node:console";

export class AppError extends Error{
    constructor(public status: number, message: string){
        super(message);
    }
}

export function errorHandler(
    error: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
){
    const status = error instanceof AppError ? error.status : 500;
    res.status(status).json({success: false, error: error.message});
}