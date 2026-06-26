import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import "dotenv/config";

export const connectDatabase = async (databaseName: string) => {
    const serverConfig = {
        host: process.env.HOST!,
        user: process.env.USER!,
        port: 57887,
        password: process.env.PASSWORD!,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    };

    let serverConnection: mysql.Connection | null = null;
    try {
        serverConnection = await mysql.createConnection(serverConfig);
        const mysql_statement = fs.readFileSync(path.join(__dirname, databaseName + "DBSchema.sql"), "utf8");
        await serverConnection.query(mysql_statement);
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
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
 }

export const userDB = connectDatabase("user");
export const  practiceHistory = connectDatabase("practiceHistory");
export const jambDB = connectDatabase("jamb");