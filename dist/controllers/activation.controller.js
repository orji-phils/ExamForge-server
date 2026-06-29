"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendToken = exports.deactivateAccount = exports.activateAccount = void 0;
const dbConnect_1 = require("../libs/dbConnect");
const crypto = __importStar(require("crypto"));
const mailer_1 = require("../service/mail/mailer");
const accountActivation_1 = require("../service/mail/accountActivation");
require("dotenv/config");
const createLogs_1 = require("../service/utility/createLogs");
const activation_schema_1 = require("../schemas/activation.schema");
// activate user's account
const activateAccount = async (req, res, next) => {
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { token, userId } = req.body;
        // validate link info
        if (!token || !userId) {
            return next({
                status: 400,
                severity: "high",
                type: "validation",
                message: "Invalid activation link."
            });
        }
        // hash the token
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        // check token validation
        const [fetchActivationData] = await connect.query(`SELECT userName, activationToken, id, role from Users WHERE id = ? AND activationToken = ? AND activationExpiresAt > NOW()`, [userId, hashToken]);
        if (!fetchActivationData.length) {
            return next({
                status: 400,
                severity: "high",
                type: "validation",
                message: "Invalid or expired activation link"
            });
        }
        await connect.beginTransaction();
        // activate new user
        await connect.query(`UPDATE Users 
            SET isActive = 1, isVerified = 1, activationToken = NULL, activationExpiresAt = NULL 
            WHERE id = ?`, [userId]);
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: userId,
            actionType: "Account Activation",
            description: `${fetchActivationData[0]?.userName} just activated their ${fetchActivationData[0]?.role} account.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "Account activated successfully. You can now log in and start practicing." });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "high",
            type: "database",
            message: "Failed to activate user account.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.activateAccount = activateAccount;
// deactivate user account by admin and master account users
const deactivateAccount = async (req, res, next) => {
    if (req.user.role === "user") {
        return next({ status: 403, message: "Admin or master account required to deactivate users account." });
    }
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { userId, userName } = activation_schema_1.activateSchema.parse(req.params);
        // get master user data
        const [masterData] = await connect.query(`SELECT id, userName FROM Users
            WHERE id = ?`, [req.user.id]);
        const master = masterData[0];
        // prevent suspending over all master account
        if (userId === 1) {
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: req.user.id,
                actionType: "",
                description: `${master?.userName} attempted suspending ${userName} an over all master.`,
                targetUser: userId
            });
            return res.status(400).json({ message: "Sorry! You can not suspend an over all master." });
        }
        await connect.beginTransaction();
        // deactive user's account
        await connect.query(`UPDATE Users 
            SET isActive = 0 
            WHERE id = ?`, [userId]);
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: master?.id,
            actionType: "Account Deactivation",
            description: `${master?.userName} deactivated ${userName} account.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: `${userName}'s account has been deactivated successfully.` });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "high",
            type: "database",
            message: "Error deactivating user account.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.deactivateAccount = deactivateAccount;
// request activation token
const resendToken = async (req, res, next) => {
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const email = req.params.email;
        // get the user's data
        const [row] = await connect.query("SELECT id, userName FROM Users WHERE email = ?", [email]);
        // get user's id
        const id = row[0]?.id;
        if (!row.length) {
            return next({
                status: 404,
                severity: "low",
                type: "validation",
                message: "User not found."
            });
        }
        // create the token and hash
        const token = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        // create a new expiry date
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const data = row[0];
        await connect.beginTransaction();
        // update user's data with the new token and expiry date
        await connect.query(`UPDATE Users 
            SET activationToken = ?, activationExpiresAt = ? 
            WHERE id = ?`, [hashToken, expiresAt, id]);
        // create activation link
        const activationLink = `${process.env.CLIENT_URL}/activateAccount?token=${token}&id=${id}`;
        const year = new Date().getFullYear();
        // send user an activation mail
        (0, mailer_1.mailer)(data?.email, "Activate Your ExamForge Account", (0, accountActivation_1.activationMail)(data?.userName, activationLink, year));
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "An activation token has been sent to your email account. Please click on the link contained in the mail to activate your ExamForge account." });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "high",
            type: "database",
            message: "Error getting new activationg token.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.resendToken = resendToken;
//# sourceMappingURL=activation.controller.js.map