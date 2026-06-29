"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jambDB = exports.practiceHistory = exports.userDB = exports.connectDatabase = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
require("dotenv/config");
const connectDatabase = async (databaseName) => {
    const serverConfig = {
        host: process.env.HOST,
        user: process.env.USER,
        port: 57887,
        password: process.env.PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    };
    let serverConnection = null;
    try {
        serverConnection = await promise_1.default.createConnection(serverConfig);
        await serverConnection.query(`Create database if not exists ${databaseName}`);
        console.log(`${databaseName} database has been created successfully.`);
    }
    catch (error) {
        console.error(`Error connecting to mysql server or creating database ${databaseName}.`);
        throw error;
    }
    finally {
        if (serverConnection) {
            await serverConnection.end();
        }
    }
    const pool = promise_1.default.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        database: databaseName,
        password: process.env.PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
};
exports.connectDatabase = connectDatabase;
exports.userDB = (0, exports.connectDatabase)("UserDB");
exports.practiceHistory = (0, exports.connectDatabase)("PracticeHistoryDB");
exports.jambDB = (0, exports.connectDatabase)("JambDB");
//# sourceMappingURL=dbConnect.js.map