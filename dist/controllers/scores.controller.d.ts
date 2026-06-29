import { NextFunction, Request, Response } from "express";
declare const getRecordId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getScores: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getScoreInfo: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getUserLastScore: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const deleteScore: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const uploadScores: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export { getRecordId, getScoreInfo, getScores, getUserLastScore, deleteScore, uploadScores };
//# sourceMappingURL=scores.controller.d.ts.map