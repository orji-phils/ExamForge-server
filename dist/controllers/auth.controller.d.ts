import type { NextFunction, Request, Response } from "express";
import "dotenv/config";
declare const signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const signin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const signout: (req: Request, res: Response, next: NextFunction) => void;
export { signup, signin, signout };
//# sourceMappingURL=auth.controller.d.ts.map