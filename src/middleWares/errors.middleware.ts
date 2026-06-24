import { NextFunction, Request, Response } from "express";
import multer from "multer";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import "dotenv/config";
import { User } from "../types";
import { systemLog } from "../service/utility/createLogs";

type CustomError = Error & {
    status: number;
    error: any;
    severity: "low" | "medium" | "high" | "critical";
    type: string;
};

const errorHandler = async (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const defaultMessage = "We're having technical issues. Please try again later";
    const { status, message,  type, severity, error } = err;

    console.log("The error data is:", err);

    try {
        // log system error 
        await systemLog({
            type: type || "server", 
            severity: severity || "medium", 
            message: message || "Unhandled server error", 
            endpoint: req.originalUrl, 
            method: req.method, 
            stack: error?.stack || err.stack, 
            user: req.user?.id || null
        });   
    } catch (error) {
        console.log("Error logging system error:", error)
    }

    // send client response
    res.status(status || 500).json({ message: message || defaultMessage });
}

const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let status = 400
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(status).json({ message: "File too large. File size must not exceed 5mb." });
        }
    }

    next();
}

export {errorHandler, multerErrorHandler };