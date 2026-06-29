import { NextFunction, Request, Response } from "express";
import { PastQuestion } from "../../types";
declare const spreadData: (req: Request, res: Response, next: NextFunction) => Promise<PastQuestion[]>;
declare const readFileContent: (req: Request, res: Response) => Promise<string>;
export { spreadData, readFileContent };
//# sourceMappingURL=fileManager.d.ts.map