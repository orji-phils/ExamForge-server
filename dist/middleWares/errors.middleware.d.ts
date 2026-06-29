import { NextFunction, Request, Response } from "express";
import "dotenv/config";
type CustomError = Error & {
    status: number;
    error: any;
    severity: "low" | "medium" | "high" | "critical";
    type: string;
};
declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const multerErrorHandler: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { errorHandler, multerErrorHandler };
//# sourceMappingURL=errors.middleware.d.ts.map