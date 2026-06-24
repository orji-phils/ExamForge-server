import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { userDB } from "../libs/dbConnect";
import { User } from "../types";
import { mailer } from "../service/mail/mailer";
import "dotenv/config";
import { resetPasswordMail } from "../service/mail/resetPassword";
import * as crypto from "crypto";
import { auditLog } from "../service/utility/createLogs";
import { multiUserSchema, passwordSchema, userProfileSchema, userSchema, userTokenSchema } from "../schemas/user.schema";
import { profileSchema } from "../schemas/profile.schema";

// get a user's data by ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
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
        const connect = await userDB;

        // fetch user's data
        const [userData] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE id = ?", [id]
        );
        const user = userData[0];

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // send out server response
        res.status(200).json(userSchema.parse(user));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching user data. Please try again later.",
            error 
        });
    }
}

// get a user's data by user name
const getUserViaUserName = async (req: Request, res: Response, next: NextFunction) => {
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
        const connect = await userDB;

        // fetch user's data
        const [userData] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE userName = ?", [userName]
        );
        const user = userData[0];
        console.log(JSON.stringify(userData));

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // send out server response
        res.status(200).json(multiUserSchema.parse(userData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching user data. Please try again later.",
            error 
        });
    }
}

// get users by their account type
const getUserByType = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === "user") {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Master or admin account required to fetch user data by user types." 
        })
    }

    try {
        const role = req.params.role;
        const connect = await userDB;

        // Fetch user's data based on the account type
        const [userData] = await connect.query<User[]>(
            `SELECT 
            up.profilePicture, u.id, u.userName, u.email, u.role, u.created_date, u.modified_date FROM Users u
            LEFT JOIN UserProfile up ON u.id = up.userId
            WHERE u.role = ?`, [role]
        );
        const user = userData[0];

        if (!user) {
            return res.status(404).json({ message: `No account with ${role} role found.` });
        }

        // send out server response
        res.status(200).json(multiUserSchema.parse(userData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching user by user type. Please try again later.",
            error 
        });
    }
}

// get all user data
const getFulldata = async (req: Request, res: Response, next: NextFunction) => {
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
        const connect = await userDB;

        // retrieve all user's data
        const [allUserData] = await connect.query<User[]>(
            `SELECT u.userName, u.email, u.role, u.created_date, u.modified_date, 
            up.firstName, up.lastName, up.profilePicture, up.dateOfBirth, up.phoneNumber, up.bio, 
            ap.bankName, ap.accountNumber
            FROM Users u LEFT JOIN UserProfile up 
            ON u.id = up.userId 
            LEFT JOIN AdminProfile ap ON 
            up.id = ap.profileId
            WHERE  u.id = ?`, [userId]
        );
        const fullData = allUserData[0];

        if (!fullData) {
            return res.status(404).json({ message: "User not found." });
        }

        // send out server response
        res.status(200).json(userProfileSchema.parse(fullData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching user's full data. Please try again later.",
            error 
        });
    }
}

// get a user's last active time
const getLastActiveTime = async (req: Request, res: Response, next: NextFunction) => {
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
        const connect = await userDB;

        const [lastActive] = await connect.query(
            "SELECT lastActive FROM LastActiveTime WHERE id = ?", [userId]
        );

        // send out server response
        res.status(200).json(lastActive);
    } catch (error) {
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error fetching last active time. Please try again later.",
            error
        });
    }
}

// delete user's data
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "critical",
            type: "unauthorized",
            message: "Sorry! Please sign in before you attempt deleting your account permanently." 
        });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userId, userName } = req.params;

        // retrieve user's data
        const [userInfo] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE id = ?", [userId]
        );
        const user = userInfo[0];

        // check if user data still exist
        if (!user) {
            return res.status(404).json({ message: "Can't delete user. User not found." });
        }

        // prevent deletion of the over all master
        if (user?.userName === "phils") {
            // log the action
            auditLog({
                performedBy: req.user.id!,
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
        await connect.query(
            "DELETE FROM Users WHERE id = ?", [userId]
        );

        // log the action
        if (req.user.id !== userId && req.user.role === "master") {
            // get master account data
            const [masterData] = await connect.query<User[]>(
                `SELECT userName, id FROM Users 
             WHERE id = ?`, [req.user.id]
            );
            const master = masterData[0];

            // log the action
            auditLog({
                performedBy: master?.id!, 
                actionType: "Delete Account", 
                description: `${master?.userName} deleted ${user?.userName}'s account.`,
                targetUser: Number(userId)
            });
        } else {
            // log the action
            auditLog({
                performedBy: req.user.id!, 
                actionType: "Account Deletion", 
                description: `${user?.userName} deleted their account.`
            });
        }
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userInfo[0]?.userName}'s account deleted successfully.` });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error deleting account. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// update the user's data
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Sorry! Please sign in to update your data."
        });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { email, userName } = userSchema.parse(req.body);
        const userId = req.user.id;

        // check if user data exist
        const [userData] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE id = ?", [userId]
        );

        if (!userData.length) {
            return res.status(404).json({ message: "Can't update user data. User not found." });
        }

        await connect.beginTransaction();
        // update user's data
        await connect.query(
            "UPDATE Users SET email = ?, userName = ? WHERE id = ?",
            [email, userName, userId]
        );

        // log the action
        auditLog({
            performedBy: Number(userId), 
            actionType: "User Update", 
            description: `${userName} updated their user data.`
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
        await  connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error updating your data. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// update last active time
const updateLastActiveTime = async (req: Request, res: Response, next: NextFunction) => {
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
        const connect = await userDB;

        await connect.query<User[]>(
            "UPDATE LastActiveTime SET lastActive = NOW() WHERE id = ?", [userId]
        );

        next();
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error recording activity. Please try again later.",
            error 
        });
    }
}

// request password reset mail
const passwordResetMail = async (req: Request, res: Response, next: NextFunction) => {
    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const email = userSchema.parse(req.params.email);

        // fetch user's data via their email address
        const [userData] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE email = ?", [email]
        );
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
        await connect.query<User[]>(
            `UPDATE Users SET 
            passwordToken = ? , passwordExpiresAt = ? 
            WHERE id = ?`, [hashToken, pTokenExpiresAt, user?.id]
        );

        // send reset password mail to user
        mailer(user?.email!, "Reset Your Account", resetPasswordMail(user?.userName!, resetLink, year));

        // log the action
        auditLog({
            performedBy: user?.id!,
            actionType: "Password Reset",
            description: `${user?.userName} requested for a password reset token.`
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: "An email with instructions on how to reset your password has been sent to you. Please use it to reset the password to your ExamForge account." });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error getting new password reset token. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// update a user's password
const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userId, token } = userTokenSchema.parse(req.params);
        const { password, confirmPassword } = passwordSchema.parse(req.body);

        // hash sent token
        const hashToken = crypto.createHash("sha256").update(token!).digest("hex");

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // fetch user's data including the hashed token
        const [userData] = await connect.query<User[]>(
            `SELECT * FROM Users 
            WHERE passwordToken = ? AND id = ? AND passwordExpiresAt > NOW()
            `, [hashToken, userId]
        );
        const user = userData[0];

        // check if user data and token exist
        if (!userData.length) {
            // log the action
            auditLog({
                performedBy: user?.id!,
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
        await connect.query(
            `UPDATE Users 
            SET password = ?, passwordExpiresAt = NULL, passwordToken = NULL 
            WHERE id = ?`, [passwordHash, userId]
        );

        // log the action
        auditLog({
            performedBy: Number(userId), 
            actionType: "Password Reset", 
            description: `${user?.userName} reset their password.`
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: "Your password has been changed successfully."});
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error resetting password. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

export { getUser, getUserViaUserName, getUserByType, getFulldata, getLastActiveTime, deleteUser, updateUser, updateLastActiveTime, passwordResetMail, updatePassword };