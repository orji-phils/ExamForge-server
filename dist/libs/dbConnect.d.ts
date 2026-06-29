import mysql from "mysql2/promise";
import "dotenv/config";
export declare const connectDatabase: (databaseName: string) => Promise<mysql.Pool>;
export declare const userDB: Promise<mysql.Pool>;
export declare const practiceHistory: Promise<mysql.Pool>;
export declare const jambDB: Promise<mysql.Pool>;
//# sourceMappingURL=dbConnect.d.ts.map