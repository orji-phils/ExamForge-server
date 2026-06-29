import { NextFunction, Request, Response } from "express";
import "dotenv/config";
declare const activateAccount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const deactivateAccount: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const resendToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { activateAccount, deactivateAccount, resendToken };
//# sourceMappingURL=activation.controller.d.ts.map