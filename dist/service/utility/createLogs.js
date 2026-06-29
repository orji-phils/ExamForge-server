"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = exports.systemLog = void 0;
const dbConnect_1 = require("../../libs/dbConnect");
const systemLog = async ({ type, severity, message, endpoint, method, stack, user }) => {
    const connect = await dbConnect_1.userDB;
    await connect.query(`INSERT INTO SystemLog
        (type, severity, message, endpoint, method, stack, user)
        VALUES (?, ?, ?, ?, ?, ? , ?)`, [type, severity, message, endpoint, method, stack, user]);
};
exports.systemLog = systemLog;
const auditLog = async ({ actionType, description, performedBy, targetUser }) => {
    const connect = await dbConnect_1.userDB;
    await connect.query(`INSERT INTO AuditLog
        (actionType, description, performedBy, targetUser)
        VALUES (?, ?, ?, ?)`, [actionType, description, performedBy, targetUser]);
};
exports.auditLog = auditLog;
//# sourceMappingURL=createLogs.js.map