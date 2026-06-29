import { NextFunction, Request, Response } from "express";
import "dotenv/config";
declare const getUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getUserViaUserName: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getUserByType: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getFulldata: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getLastActiveTime: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const updateLastActiveTime: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const passwordResetMail: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updatePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getUser, getUserViaUserName, getUserByType, getFulldata, getLastActiveTime, deleteUser, updateUser, updateLastActiveTime, passwordResetMail, updatePassword };
//# sourceMappingURL=user.controller.d.ts.map