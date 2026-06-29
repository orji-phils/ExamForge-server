import { NextFunction, Request, Response } from "express";
declare const getSingleUpgradeRequest: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getUpgradeData: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getUpgradeRequests: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const deleteRequest: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const revokeAccess: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const restoreAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const rejectRequest: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const approveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const upgradeToMaster: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const upgradeAccount: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export { getSingleUpgradeRequest, getUpgradeData, getUpgradeRequests, deleteRequest, revokeAccess, restoreAdmin, rejectRequest, approveRequest, upgradeToMaster, upgradeAccount };
//# sourceMappingURL=upgradeRequest.controller.d.ts.map