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
declare const systemLog: ({ type, severity, message, endpoint, method, stack, user }: SystemLogOptions) => Promise<void>;
declare const auditLog: ({ actionType, description, performedBy, targetUser }: AuditLogOptions) => Promise<void>;
export { systemLog, auditLog };
//# sourceMappingURL=createLogs.d.ts.map