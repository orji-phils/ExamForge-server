import { NextFunction, Request, Response } from "express";
declare const userDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const adminDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const masterDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { userDashboard, adminDashboard, masterDashboard };
//# sourceMappingURL=dashboard.controller.d.ts.map