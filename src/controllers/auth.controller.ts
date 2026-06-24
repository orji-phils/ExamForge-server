import type { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as  crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { userDB } from "../libs/dbConnect";
import { User } from "../types";
import existingUser from "../service/utility/existingUser";
import { mailer } from "../service/mail/mailer";
import { activationMail } from "../service/mail/accountActivation";
import { auditLog } from "../service/utility/createLogs";
import { signupSchema } from "../schemas/auth.schema";

// handle new user signup
const signup = async (req: Request, res: Response, next: NextFunction) => {
    const pool = await userDB;
    const connect = await pool.getConnection();

    try {
        const { email, userName, password, confirmPassword } = signupSchema.parse(req.body);
        const year = new Date().getFullYear();

        // compare passwords
        if (password !== confirmPassword) {
            return next({ 
                status: 400, 
                severity: "low",
                type: "validation",
                message: "Sorry. Passwords do not match. Please check the passwords and try again" });
        }

        // check unique records
        if (await existingUser("email", email)) {
            return next({ status: 400, message: "Email already exists. Please try another email or log into your account." });
        }

        if (await existingUser("userName", userName)) {
            return next({ 
                status: 400, 
                severity: "medium",
                type: "validation",
                message: "User name already exists. Please enter another user name." });
        }

        // hash user's password
        const hash = await bcrypt.hash(password, 10);

        // create random token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        // create expiry date
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await connect.beginTransaction();
        // register new user's data
        const [data] = await connect.query<ResultSetHeader>(
            `INSERT INTO Users 
            (email, userName, role, password, activationToken, activationExpiresAt, isActive) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, userName, "user", hash, hashedToken, expiresAt, 0]
        );

        // log the action
        auditLog({
            performedBy: data.insertId!, 
            actionType: "Account Creation", 
            description: `${userName} successfully created their account.`
        });
        console.log("After logging user's registeration.");

        // create activation link
        const activationLink = `${process.env.CLIENT_URL}/activateAccount?token=${rawToken}&id=${data.insertId}`;

        // send activation mail to user
        await mailer(email, "Activate Your ExamForge Account", activationMail(userName, activationLink, year));
        await connect.commit();

        // send out server response
        res.status(201).json({ message: `Account created successfully. Please check your email for a link to activate your account.` });
    } catch (error) {
        await connect.rollback();
        if ((error as any).code === "ER_DUP_ENTRY") {
  return next({ status: 400, message: "Email or username already exists." });
}
        next({ 
            status: 500, 
            severity: "critical",
            type: "authentication",
            message: "Error signing up.",
            error });
    } finally {
        await connect.release();
    }
}

// log users into their existing account
const signin = async (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.stringify(req.body));
    try {
        const { userName, password } = req.body;
        const connect = await userDB;

        // fetch user's data
        const [userData] = await connect.query<User[]>(
            "SELECT * FROM Users WHERE userName = ?", userName
        );

        // check user
        if (!userData.length) {
            return next({ 
                status: 400, 
                severity: "high",
                type: "authentication",
                message: "Invalid user name or password. Please check your credentials and try again" });
        }
        const user: User = userData[0]!;

        // validate password
        if (!await bcrypt.compare(password, user.password)) {
            // log user action
            auditLog({
                performedBy: user.id,
                actionType: "Wrong Password",
                description: `${user.userName} tried logging in with an incorrect password.`
            });

            return next({ 
                status: 401,
                severity: "medium",
                type: "authentication",
                 message: "Invalid user name or password. Please check your credentials and try again" });
        }

        // check for account activation
        if (user?.isVerified === 0) {
            return next({ 
                status: 403, 
                severity: "low",
                type: "authentication",
                message: "Sorry! your account is not activated yet. Please check for an email from us to activate your ExamForge account." });
        }

        // check for deactivated account
        if (user?.isActive === 0) {
            return next({ 
                status: 403, 
                severity: "high",
                type: "authentication",
                message: "Your account has been deactivated. Please contact the help desk for guidance on how to reactivate your account." });
        }

        // strip off important information
        const { password: psw, created_date, modified_date, ...rest } = user;

        // create a jwt token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.AUTH_SECRET!,
            {expiresIn: '6h'}
        );

        // send out server response
        res.cookie("ExamForge_token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            partitioned: true,
            maxAge: 1000 * 60 * 60 * 6
        })
        .status(200).json(rest);
    } catch (error) {
        next({ 
            status: 500, 
            severity: "high",
            type: "authentication",
            message: "Error signing in. Please try again later.",
            error });
    }
}

const signout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("ExamForge_token").status(200).json({ response: "Your account is signed out successfully." });
    } catch (error) {
        next({ status: 500, error });
    }
}

export { signup, signin, signout };