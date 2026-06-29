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
exports.updatePassword = exports.passwordResetMail = exports.updateLastActiveTime = exports.updateUser = exports.deleteUser = exports.getLastActiveTime = exports.getFulldata = exports.getUserByType = exports.getUserViaUserName = exports.getUser = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const dbConnect_1 = require("../libs/dbConnect");
const mailer_1 = require("../service/mail/mailer");
require("dotenv/config");
const resetPassword_1 = require("../service/mail/resetPassword");
const crypto = __importStar(require("crypto"));
const createLogs_1 = require("../service/utility/createLogs");
const user_schema_1 = require("../schemas/user.schema");
// get a user's data by ID
const getUser = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Please sign in to get your data."
        });
    }
    try {
        const id = req.user.id;
        const connect = await dbConnect_1.userDB;
        // fetch user's data
        const [userData] = await connect.query("SELECT * FROM Users WHERE id = ?", [id]);
        const user = userData[0];
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // send out server response
        res.status(200).json(user_schema_1.userSchema.parse(user));
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching user data. Please try again later.",
            error
        });
    }
};
exports.getUser = getUser;
// get a user's data by user name
const getUserViaUserName = async (req, res, next) => {
    if (req.user.role === "user") {
        return next({
            status: 403,
            severity: "high",
            type: "unauthorized",
            message: "Admin or Master privelege is required."
        });
    }
    try {
        const userName = req.params.userName;
        console.log("The user name is:", userName);
        const connect = await dbConnect_1.userDB;
        // fetch user's data
        const [userData] = await connect.query("SELECT * FROM Users WHERE userName = ?", [userName]);
        const user = userData[0];
        console.log(JSON.stringify(userData));
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // send out server response
        res.status(200).json(user_schema_1.multiUserSchema.parse(userData));
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching user data. Please try again later.",
            error
        });
    }
};
exports.getUserViaUserName = getUserViaUserName;
// get users by their account type
const getUserByType = async (req, res, next) => {
    if (req.user.role === "user") {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Master or admin account required to fetch user data by user types."
        });
    }
    try {
        const role = req.params.role;
        const connect = await dbConnect_1.userDB;
        // Fetch user's data based on the account type
        const [userData] = await connect.query(`SELECT 
            up.profilePicture, u.id, u.userName, u.email, u.role, u.created_date, u.modified_date FROM Users u
            LEFT JOIN UserProfile up ON u.id = up.userId
            WHERE u.role = ?`, [role]);
        const user = userData[0];
        if (!user) {
            return res.status(404).json({ message: `No account with ${role} role found.` });
        }
        // send out server response
        res.status(200).json(user_schema_1.multiUserSchema.parse(userData));
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching user by user type. Please try again later.",
            error
        });
    }
};
exports.getUserByType = getUserByType;
// get all user data
const getFulldata = async (req, res, next) => {
    if (req.user.role === "user") {
        return next({
            status: 403,
            severity: "high",
            type: "unauthorized",
            message: "Master or admin account required to fetch user's full data."
        });
    }
    try {
        const userId = req.params.id;
        const connect = await dbConnect_1.userDB;
        // retrieve all user's data
        const [allUserData] = await connect.query(`SELECT u.userName, u.email, u.role, u.created_date, u.modified_date, 
            up.firstName, up.lastName, up.profilePicture, up.dateOfBirth, up.phoneNumber, up.bio, 
            ap.bankName, ap.accountNumber
            FROM Users u LEFT JOIN UserProfile up 
            ON u.id = up.userId 
            LEFT JOIN AdminProfile ap ON 
            up.id = ap.profileId
            WHERE  u.id = ?`, [userId]);
        const fullData = allUserData[0];
        if (!fullData) {
            return res.status(404).json({ message: "User not found." });
        }
        // send out server response
        res.status(200).json(user_schema_1.userProfileSchema.parse(fullData));
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching user's full data. Please try again later.",
            error
        });
    }
};
exports.getFulldata = getFulldata;
// get a user's last active time
const getLastActiveTime = async (req, res, next) => {
    if (req.user.role === "user") {
        return next({
            status: 403,
            severity: "high",
            type: "unauthorized",
            message: "Master or admin account required to view last active time."
        });
    }
    try {
        const userId = req.params.userId;
        const connect = await dbConnect_1.userDB;
        const [lastActive] = await connect.query("SELECT lastActive FROM LastActiveTime WHERE id = ?", [userId]);
        // send out server response
        res.status(200).json(lastActive);
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching last active time. Please try again later.",
            error
        });
    }
};
exports.getLastActiveTime = getLastActiveTime;
// delete user's data
const deleteUser = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "critical",
            type: "unauthorized",
            message: "Sorry! Please sign in before you attempt deleting your account permanently."
        });
    }
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { userId, userName } = req.params;
        // retrieve user's data
        const [userInfo] = await connect.query("SELECT * FROM Users WHERE id = ?", [userId]);
        const user = userInfo[0];
        // check if user data still exist
        if (!user) {
            return res.status(404).json({ message: "Can't delete user. User not found." });
        }
        // prevent deletion of the over all master
        if (user?.userName === "phils") {
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: req.user.id,
                actionType: "Account Deletion",
                description: `${user?.userName} attempted to delete an over all user.`
            });
            return next({
                status: 400,
                severity: "medium",
                type: "Deletion attempt",
                message: "Sorry! you cannot delete an overall master user."
            });
        }
        connect.beginTransaction();
        // delete user's account
        await connect.query("DELETE FROM Users WHERE id = ?", [userId]);
        // log the action
        if (req.user.id !== userId && req.user.role === "master") {
            // get master account data
            const [masterData] = await connect.query(`SELECT userName, id FROM Users 
             WHERE id = ?`, [req.user.id]);
            const master = masterData[0];
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: master?.id,
                actionType: "Delete Account",
                description: `${master?.userName} deleted ${user?.userName}'s account.`,
                targetUser: Number(userId)
            });
        }
        else {
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: req.user.id,
                actionType: "Account Deletion",
                description: `${user?.userName} deleted their account.`
            });
        }
        await connect.commit();
        // send out server response
        res.status(200).json({ message: `${userInfo[0]?.userName}'s account deleted successfully.` });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error deleting account. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.deleteUser = deleteUser;
// update the user's data
const updateUser = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Sorry! Please sign in to update your data."
        });
    }
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { email, userName } = user_schema_1.userSchema.parse(req.body);
        const userId = req.user.id;
        // check if user data exist
        const [userData] = await connect.query("SELECT * FROM Users WHERE id = ?", [userId]);
        if (!userData.length) {
            return res.status(404).json({ message: "Can't update user data. User not found." });
        }
        await connect.beginTransaction();
        // update user's data
        await connect.query("UPDATE Users SET email = ?, userName = ? WHERE id = ?", [email, userName, userId]);
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: Number(userId),
            actionType: "User Update",
            description: `${userName} updated their user data.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "User data updated successfully" });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error updating your data. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.updateUser = updateUser;
// update last active time
const updateLastActiveTime = async (req, res, next) => {
    if (!req.user) {
        return next({
            statusbar: 401,
            severity: "low",
            type: "unauthorized",
            message: "Please sign in to record your activity."
        });
    }
    try {
        const userId = req.user.id;
        const connect = await dbConnect_1.userDB;
        await connect.query("UPDATE LastActiveTime SET lastActive = NOW() WHERE id = ?", [userId]);
        next();
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error recording activity. Please try again later.",
            error
        });
    }
};
exports.updateLastActiveTime = updateLastActiveTime;
// request password reset mail
const passwordResetMail = async (req, res, next) => {
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const email = user_schema_1.userSchema.parse(req.params.email);
        // fetch user's data via their email address
        const [userData] = await connect.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = userData[0];
        // check if user exist
        if (!userData.length) {
            return res.status(404).json({ message: "User not found." });
        }
        // create the password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        // create expiry date
        const pTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        // get the current year
        const year = new Date().getFullYear();
        // get the link for change password page
        const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user?.id}`;
        await connect.beginTransaction();
        // add the hashed token to user's data
        await connect.query(`UPDATE Users SET 
            passwordToken = ? , passwordExpiresAt = ? 
            WHERE id = ?`, [hashToken, pTokenExpiresAt, user?.id]);
        // send reset password mail to user
        (0, mailer_1.mailer)(user?.email, "Reset Your Account", (0, resetPassword_1.resetPasswordMail)(user?.userName, resetLink, year));
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: user?.id,
            actionType: "Password Reset",
            description: `${user?.userName} requested for a password reset token.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "An email with instructions on how to reset your password has been sent to you. Please use it to reset the password to your ExamForge account." });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error getting new password reset token. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.passwordResetMail = passwordResetMail;
// update a user's password
const updatePassword = async (req, res, next) => {
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { userId, token } = user_schema_1.userTokenSchema.parse(req.params);
        const { password, confirmPassword } = user_schema_1.passwordSchema.parse(req.body);
        // hash sent token
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        // hash password
        const passwordHash = await bcrypt.hash(password, 10);
        // fetch user's data including the hashed token
        const [userData] = await connect.query(`SELECT * FROM Users 
            WHERE passwordToken = ? AND id = ? AND passwordExpiresAt > NOW()
            `, [hashToken, userId]);
        const user = userData[0];
        // check if user data and token exist
        if (!userData.length) {
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: user?.id,
                actionType: "Invalid Token",
                description: `${user?.userName} tried resetting their password with an invalid token.`
            });
            return next({
                status: 400,
                severity: "low",
                type: "validation",
                message: "Invalid or expired password reset link."
            });
        }
        await connect.beginTransaction();
        // attempt changing user's password
        await connect.query(`UPDATE Users 
            SET password = ?, passwordExpiresAt = NULL, passwordToken = NULL 
            WHERE id = ?`, [passwordHash, userId]);
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: Number(userId),
            actionType: "Password Reset",
            description: `${user?.userName} reset their password.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "Your password has been changed successfully." });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error resetting password. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=user.controller.js.map