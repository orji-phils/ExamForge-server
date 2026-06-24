import { NextFunction, Request, Response } from "express";
import { userDB } from "../libs/dbConnect";
import { mailer } from "../service/mail/mailer";
import { masterUpgradeMail } from "../service/mail/masterUpgrade";
import { adminApprovalMail } from "../service/mail/adminApproval";
import { auditLog } from "../service/utility/createLogs";
import { multiUpgradeSchema, StatusForm, UpgradeForm, upgradeSchema } from "../schemas/upgrades.schema";
import { UserForm } from "../schemas/user.schema";

// get single account upgrade request
const getSingleUpgradeRequest = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next({ 
                status: 401, 
                severity: "high",
                type: "unauthorized",
                message: "Please sign in to fetch this data." });
        }

    try {
        const userId = upgradeSchema.parse(req.params.id);
        const connect = await userDB;

        const [upgradeData] = await connect.query<UpgradeForm[]>(
            `SELECT * FROM AccountUpgrade WHERE userId = ?`, [userId]
        );
        const data = upgradeData[0];

        if (!data) {
            return res.status(404).json({ message: "Upgrade data not found." });
        }

        // send out server response
        res.status(200).json(upgradeSchema.parse(data));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error retrieving upgrade data. Please try again later.",
            error 
        });
    }
}

// Get user's request data via their user name
const getUpgradeData = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Only master account users can access this data." 
        });
    }

    try {
        const connect = await userDB;
        const userName = req.params.userName;

        const [upgradeData] = await connect.query<UpgradeForm[]>(
            `SELECT 
            u.userName, u.email, u.role, u.created_date, up.profilePicture ,
            au.userId, au.status, au.request_date, au.response_date 
            FROM Users u 
            LEFT JOIN AccountUpgrade au  ON u.id = au.userId 
            LEFT JOIN UserProfile up ON au.userId = up.userId 
            WHERE u.userName = ?`, [userName]
        );
        const upgrade = upgradeData[0];
        console.log("The response is:", JSON.stringify(upgrade));

        const [userData] = await connect.query<UserForm[]>(
            `SELECT userName FROM Users WHERE userName = ?`, [userName]
        );
        const user = userData[0];

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!upgrade) {
            return res.status(404).json({ message: `No upgrade request from ${userName}` });
        }

        // send out server response
        res.status(200).json(multiUpgradeSchema.parse(upgradeData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching all upgrades. Please try again later.",
            error 
        });
    }
}


// get all upgraded account request
const getUpgradeRequests = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Only master account users can access this data." 
        });
    }

    try {
        const connect = await userDB;
        const status = req.params.status;
        const allowedStatus = ["pending", "approved", "revoked", "rejected"];

        const [upgradeData] = await connect.query<UpgradeForm[]>(
            `SELECT 
            u.userName, u.email, u.role, u.created_date, up.profilePicture ,
            au.userId, au.status, au.request_date, au.response_date 
            FROM Users u 
            LEFT JOIN AccountUpgrade au  ON u.id = au.userId 
            LEFT JOIN UserProfile up ON au.userId = up.userId 
            WHERE au.status = ?`, [status]
        );

        if (!allowedStatus.includes(status!)) {
            // log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "Invalid Request",
                description: `${upgradeData[0]?.userName} attempted to get upgrades with an invalid type.`
            });

            return res.status(400).json({ message: "Invalid status type." });
        }

        // send out server response
        res.status(200).json(multiUpgradeSchema.parse(upgradeData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching all upgrades. Please try again later.",
            error 
        });
    }
}

// delete user's request by master user only 
const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.stringify(req.params));
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Master account required to delete an upgrade." 
        });
    }

    try {
        const { userId, userName } = upgradeSchema.parse(req.params);
        const connect = await userDB;

        const [getRequest] = await connect.query<UpgradeForm[]>(
            "SELECT * FROM AccountUpgrade WHERE userId = ?", [userId]
        );

        if (!getRequest.length) {
            return res.status(404).json({ message: "Request not found." });
        }

        const [deleteRequest] = await connect.query(
            "Delete FROM AccountUpgrade WHERE userId = ?", [userId]
        );

        // send out server response
        res.status(200).json({ message: `${userName}'s upgrade request deleted successfully.` });
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error deleting upgrade request. Please try again later.",
            error 
        });
    }
}

// revoke status by master only
const revokeAccess = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Master account required to revoke requests." 
        });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const {userId, userName }= req.params;

        const [getRequest] = await connect.query<UpgradeForm[]>(
            "SELECT * FROM AccountUpgrade WHERE userId = ?", [userId]
        );
        const request = getRequest[0];

        // get master user data
        const [masterData] = await connect.query<UserForm[]>(
            `SELECT id, userName FROM Users
            WHERE id = ?`, [req.user.id]
        );
        const master = masterData[0];

        if (userName === "phils") {
            // log the action
            auditLog({
                performedBy: master?.id!,
                actionType: "Revoke Request",
                description: `${master?.userName} attempted revoking an over all master account.`,
                targetUser: Number(userId)
            });

            return res.status(400).json({ message: "Sorry! You cannot revoke an overall master user." });
        }

        // validate request
        if (!request) {
            return res.status(404).json({ message: "Request not found." });
        }

        if (request?.status === "rejected") {
            // log the action
            auditLog({
                performedBy: master?.id!,
                actionType: "Already Revoked",
                description: `${master?.userName} attempted revoking an already revoked user.`
            });

            return res.status(400).json({ message: `${userName}'s account status already revoked earlier.` });
        }

        await connect.beginTransaction();
        // revoke user's upgrade request
        await connect.query(
            `UPDATE AccountUpgrade 
            SET status = 'revoked'
            WHERE userId = ?`, [userId]
        );

        // reverse account back to user
        await connect.query(
            `UPDATE Users 
            SET role = 'user' 
            WHERE id = ?`, [userId]
        );

        // log the action
        auditLog({
            performedBy: master?.id!, 
            actionType:"Revoke Account", 
            description: `${master?.userName} revoked ${userName} ${request?.status} status back to user.`, 
            targetUser: Number(userId)
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userName}'s account is now revoked back to user.` });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error revoking user. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// restore revoked admin
const restoreAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Sorry! Only master users can reinstate other users."
        });
    }
    
    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userId, userName } = upgradeSchema.parse(req.params);
        // get admin dashboard url
        const mailLink = `${process.env.CLIENT_URL}/adminDashboard`;

        // check user's data
        const [userData] = await connect.query<UpgradeForm[]>(
            `SELECT au.userId, au.status, u.id, u.email FROM AccountUpgrade au
            LEFT JOIN Users u ON
            u.id = au.userId
            WHERE u.id = ?`, [userId]
        );
        const user = userData[0];

        // fetch master data
        const [masterData] = await connect.query<UserForm[]>(
            `SELECT userName, id FROM Users WHERE id = ?`, [req.user.id]
        );
        const master = masterData[0];

        // check if user is already an admin
        if (user?.status === "approved") {
            // log the action 
            auditLog({
                performedBy: master?.id!,
                actionType: "Restore Admin",
                description: `${master?.userName} attempted reinstating ${userName} after they've been reinstated.`,
                targetUser: userId
            });

            return res.status(422).json({ message: `${userName} have already been reinstated as an admin.` });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await connect.beginTransaction();
        // approve admin upgrade request again
        await connect.query(
            `UPDATE AccountUpgrade 
            SET status = 'approved'
            Where userId = ?`, [userId]
        );

        // restore user back to their admin level
        await connect.query(
            `UPDATE Users 
            SET role = 'admin'
            WHERE id = ?`, [userId]
        );

        // send user an upgrade mail
        // mailer(user?.email, "Restore Admin", "");

        // log the action
        auditLog({
            performedBy: master?.id!,
            actionType: "Role Reinstatement",
            description: `${master?.userName} successfully restored ${userName} back to their admin level.`,
            targetUser: userId
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userName}'s account is now restored back to admin.` });
    } catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error restoring user back to admin. Please try again later.",
            error
        });
    } finally {
        await connect.release();
    }
}

// reject user's pending request by master user only
const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Only master account users can reject pending requests." });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userId, userName } = upgradeSchema.parse(req.params);

        const [isPending] = await connect.query<[]>(
            "SELECT status FROM AccountUpgrade WHERE userId = ? AND status = 'pending'", [userId]
        );

        if (!isPending.length) {
            return res.status(400).json({ message: `No pending request from ${userName}` });
        }

        await connect.beginTransaction();
        // decline user's request
        await connect.query(
            "UPDATE AccountUpgrade SET status = 'rejected' WHERE userId = ?", [userId]
        );

        // get master user data
        const [masterData] = await connect.query<UserForm[]>(
            `SELECT id, userName FROM Users 
            WHERE id = ?`, [req.user.id]
        );
        const master = masterData[0];

        // log the action
        auditLog({
            performedBy: master?.id!, 
            actionType: "Decline Request", 
            description: `${master?.userName} declined ${userName}'s admin upgrade request.`, 
            targetUser: Number(userId)
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userName}'s admin request has been declined.` });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error declining user request. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// approve user's upgrade request by master user only
const approveRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Only master account users can upgrade regular users." 
        });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userName, userId } = upgradeSchema.parse(req.params);

        // check if user still pending
        const [isPending] = await connect.query<UpgradeForm[]>(
            "SELECT * FROM AccountUpgrade WHERE userId = ? AND status = 'pending'", [userId]
        );

        if (!isPending.length) {
            return res.status(404).json({ message: `Found no pending request for ${userName}`});
        }

        await connect.beginTransaction();
        // approve user's upgrade request
        await connect.query(
            `UPDATE AccountUpgrade SET status = 'approved' WHERE userId = ?`, [userId]
        );

        // upgrade user's role to admin
        await connect.query(
            "UPDATE Users SET role = 'admin' WHERE id = ?", [userId]
        );

        // get user's data
        const [userData] = await connect.query<UserForm[]>(
            "SELECT * FROM Users WHERE id = ?", [userId]
        );
        const user = userData[0];
        const year = new Date().getFullYear();

        // generate link to admin dashboard
        const dashboardLink = `${process.env.CLIENT_URL}/adminDashboard`;

        // send a confirmation mail to user
        mailer(user?.email!, "Account upgraded to admin", adminApprovalMail(user?.userName!, dashboardLink, year));

        // get master data
        const [masterData] = await connect.query<UserForm[]>(
            `SELECT userName, id FROM Users
            WHERE id = ?`, [req.user.id]
        );
        const master = masterData[0];

        // log the action
        auditLog({
            performedBy: master?.id!, 
            actionType: "Account Upgraded", 
            description: `${master?.userName} upgraded ${userName}'s account to admin.`, 
            targetUser: Number(userId)
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userName} has been granted admin privilege.` });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error approving user request. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// upgrade an admin account to master by master users only
const upgradeToMaster = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ 
            status: 403, 
            severity: "high",
            message: "Master account user required for master upgrades." });
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { userId, userName } = upgradeSchema.parse(req.params);

        // check if user exist
        const [getUser] = await connect.query<UserForm[]>(
            "Select * FROM Users WHERE id = ?", [userId]
        );

        const user = getUser[0];
        const year = new Date().getFullYear();

        if (!user) {
            return res.status(404).json({ message: "Can't upgrade to master. User not found." });
        }

        await connect.beginTransaction();
        // upgrade user to master
        await connect.query(
            "UPDATE Users SET role = 'master' WHERE id = ?", [userId]
        );

        // get master user data
        const [masterData] = await connect.query<UserForm[]>(
            `SELECT id, userName FROM Users
            WHERE id = ?`, [req.user.id]
        );
        const master = masterData[0];

        // log the action
        auditLog({
            performedBy: master?.id!, 
            actionType: "Master Upgrade", 
            description: `${master?.userName} upgraded ${userName} to master.`, 
            targetUser: Number(userId!)
        });

        // generate the master dashboard link
        const dashboardLink = `${process.env.CLIENT_URL}/masterDashboard`;

        // send a conformation mail to user
        mailer(user?.email!, "Account upgraded to master", masterUpgradeMail(user?.userName!, dashboardLink, year));
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${userName}'s is now granted master privileges.` })
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error upgrading user account to master. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

// apply for account upgrade
const upgradeAccount = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Sorry! Please sign in to apply for account upgrade."});
    }

    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const userId = upgradeSchema.parse(req.user.id);

        // get user's upgrade data if available
        const [upgradeData] = await connect.query<UpgradeForm[]>(
            `SELECT au.status, u.userName FROM AccountUpgrade au
            JOIN Users u On 
            u.id = au.userId
            WHERE userId = ?`, [userId]
        );
        const data = upgradeData[0];

        if (data?.status === "pending") {
            // log the action
            auditLog({
                performedBy: Number(userId!),
                actionType: "Multiple Upgrade",
                description: `Multiple upgrade request detected from ${data?.userName}.`
            });

            return res.status(422).json({ message: "You already have a pending upgrade request." });
        }

        if (data) {
            return res.status(422).json({ message: "Sorry! You can't apply now, your old application data still exist." });
        }

        const [userData] = await connect.query<UserForm[]>(
            `SELECT id, userName FROM Users
            WHERE id = ?`, [userId]
        );
        const user = userData[0];

        await connect.beginTransaction();
        // request account upgrade
        await connect.query(
            `INSERT INTO AccountUpgrade 
            (userId, status) 
            VALUES (?, ?)`, 
            [userId, "pending"]
        );

        // log the action
        auditLog({
            performedBy: Number(userId!), 
            actionType: "Upgrade Request", 
            description: `${user?.userName} applied for an account upgrade.`
        });
        await connect.commit();

        // send out server response
        res.status(201).json({ message: "Request sent successfully. Waitting admin approval" });
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error sending upgrade request. Please try again later.",
            error 
        });
    } finally {
        await connect.release();
    }
}

export { getSingleUpgradeRequest, getUpgradeData, getUpgradeRequests, deleteRequest, revokeAccess, restoreAdmin, rejectRequest, approveRequest, upgradeToMaster, upgradeAccount };