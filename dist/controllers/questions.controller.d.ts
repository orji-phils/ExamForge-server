import { NextFunction, Request, Response } from "express";
declare const getDatabases: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getTables: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getYears: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getPastQuestionById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const getRandomQuestions: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getPastQuestionByYear: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const deletePastQuestion: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const uploadPastQuestion: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export { getDatabases, getTables, getYears, getPastQuestionByYear, getPastQuestionById, getRandomQuestions, deletePastQuestion, uploadPastQuestion };
//# sourceMappingURL=questions.controller.d.ts.map