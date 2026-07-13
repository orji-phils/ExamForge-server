import mysql from "mysql2/promise";
import "dotenv/config";

export const connectDatabase = async (databaseName: string) => {
    console.log({
    HOST: process.env.MYSQLHOST,
    USER: process.env.MYSQLUSER,
    PASSWORD_EXISTS: !!process.env.MYSQLPASSWORD,
    DATABASE: process.env.MYSQLDATABASE,
    DB_PORT: process.env.MYSQLPORT,
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLPORT: process.env.MYSQLPORT
});
    const serverConfig = {
        host: process.env.MYSQLHOST!,
        user: process.env.MYSQLUSER!,
        port: Number(process.env.MYSQLPORT!) || 3306,
        password: process.env.MYSQLPASSWORD!,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    };

    let serverConnection: mysql.Connection | null = null;
    try {
        serverConnection = await mysql.createConnection(serverConfig);
        await serverConnection.query(`Create database if not exists ${databaseName}`);
        console.log(`${databaseName} database has been created successfully.`);
    } catch (error) {
        console.error(`Error connecting to mysql server or creating database ${databaseName}.`);
        throw error;
    } finally {
        if (serverConnection) {
            await serverConnection.end();
        }
    }

    const pool = mysql.createPool({
        host: process.env.HOST!,
        user: process.env.USER!,
        database: databaseName,
        password: process.env.PASSWORD!,
        port: Number(process.env.DB_PORT!) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
 }

export const userDB = connectDatabase("UserDB");
export const  practiceHistory = connectDatabase("PracticeHistoryDB");
export const jambDB = connectDatabase("JambDB");