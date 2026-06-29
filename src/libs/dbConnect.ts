import mysql from "mysql2/promise";
import "dotenv/config";

export const connectDatabase = async (databaseName: string) => {
    console.log("Host:", process.env.HOST);
    console.log("Host:", process.env.MYSQLHOST);
    console.log("Port:", process.env.PORT);
    console.log("Port:", process.env.MYSQLPORT);
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
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
 }

export const userDB = connectDatabase("UserDB");
export const  practiceHistory = connectDatabase("PracticeHistoryDB");
export const jambDB = connectDatabase("JambDB");