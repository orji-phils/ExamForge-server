import { NextFunction } from "express";
import { userDB } from "../../libs/dbConnect"

type SystemLogOptions = {
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    endpoint: string;
    method: string;
    stack?: string;
    user: number | null;
};

type AuditLogOptions = {
    actionType: string;
    description: string;
    performedBy: number;
    targetUser?: number;
};

const systemLog = async ({ type, severity, message, endpoint, method, stack, user }: SystemLogOptions) => {
    const connect = await userDB;

    await connect.query(
        `INSERT INTO SystemLog
        (type, severity, message, endpoint, method, stack, user)
        VALUES (?, ?, ?, ?, ?, ? , ?)`,
        [type, severity, message, endpoint, method, stack, user]        );
}

const auditLog = async ({ actionType, description, performedBy, targetUser }: AuditLogOptions) => {
    const connect = await userDB;

    await connect.query(
        `INSERT INTO AuditLog
        (actionType, description, performedBy, targetUser)
        VALUES (?, ?, ?, ?)`,
        [actionType, description, performedBy, targetUser]
    );
}

export { systemLog, auditLog };