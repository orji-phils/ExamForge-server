import { NextFunction, Request, Response } from "express";
declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const deleteProfile: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const createProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getProfile, deleteProfile, createProfile };
//# sourceMappingURL=profile.controller.d.ts.map