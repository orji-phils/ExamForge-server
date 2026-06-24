import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.ExamForge_token;

    if (!token) return next({ status: 401, message: 'Unauthorized' });

    try {
        // decode the cookie
        const decoded = jwt.verify(
            token, 
            process.env.AUTH_SECRET as Secret
        ) as JwtPayload & { id: number, role: string };

        req.user = decoded;
        next();
    } catch (error) {
        next({ status: 403, message: "forbidden" });
    }
}

export { verifyToken };