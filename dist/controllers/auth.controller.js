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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.signup = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
require("dotenv/config");
const dbConnect_1 = require("../libs/dbConnect");
const existingUser_1 = __importDefault(require("../service/utility/existingUser"));
const mailer_1 = require("../service/mail/mailer");
const accountActivation_1 = require("../service/mail/accountActivation");
const createLogs_1 = require("../service/utility/createLogs");
const auth_schema_1 = require("../schemas/auth.schema");
// handle new user signup
const signup = async (req, res, next) => {
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { email, userName, password, confirmPassword } = auth_schema_1.signupSchema.parse(req.body);
        const year = new Date().getFullYear();
        // compare passwords
        if (password !== confirmPassword) {
            return next({
                status: 400,
                severity: "low",
                type: "validation",
                message: "Sorry. Passwords do not match. Please check the passwords and try again"
            });
        }
        // check unique records
        if (await (0, existingUser_1.default)("email", email)) {
            return next({ status: 400, message: "Email already exists. Please try another email or log into your account." });
        }
        if (await (0, existingUser_1.default)("userName", userName)) {
            return next({
                status: 400,
                severity: "medium",
                type: "validation",
                message: "User name already exists. Please enter another user name."
            });
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
        const [data] = await connect.query(`INSERT INTO Users 
            (email, userName, role, password, activationToken, activationExpiresAt, isActive) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [email, userName, "user", hash, hashedToken, expiresAt, 0]);
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: data.insertId,
            actionType: "Account Creation",
            description: `${userName} successfully created their account.`
        });
        console.log("After logging user's registeration.");
        // create activation link
        const activationLink = `${process.env.CLIENT_URL}/activateAccount?token=${rawToken}&id=${data.insertId}`;
        // send activation mail to user
        await (0, mailer_1.mailer)(email, "Activate Your ExamForge Account", (0, accountActivation_1.activationMail)(userName, activationLink, year));
        await connect.commit();
        // send out server response
        res.status(201).json({ message: `Account created successfully. Please check your email for a link to activate your account.` });
    }
    catch (error) {
        await connect.rollback();
        if (error.code === "ER_DUP_ENTRY") {
            return next({ status: 400, message: "Email or username already exists." });
        }
        next({
            status: 500,
            severity: "critical",
            type: "authentication",
            message: "Error signing up.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.signup = signup;
// log users into their existing account
const signin = async (req, res, next) => {
    console.log(JSON.stringify(req.body));
    try {
        const { userName, password } = req.body;
        const connect = await dbConnect_1.userDB;
        // fetch user's data
        const [userData] = await connect.query("SELECT * FROM Users WHERE userName = ?", userName);
        // check user
        if (!userData.length) {
            return next({
                status: 400,
                severity: "high",
                type: "authentication",
                message: "Invalid user name or password. Please check your credentials and try again"
            });
        }
        const user = userData[0];
        // validate password
        if (!await bcrypt.compare(password, user.password)) {
            // log user action
            (0, createLogs_1.auditLog)({
                performedBy: user.id,
                actionType: "Wrong Password",
                description: `${user.userName} tried logging in with an incorrect password.`
            });
            return next({
                status: 401,
                severity: "medium",
                type: "authentication",
                message: "Invalid user name or password. Please check your credentials and try again"
            });
        }
        // check for account activation
        if (user?.isVerified === 0) {
            return next({
                status: 403,
                severity: "low",
                type: "authentication",
                message: "Sorry! your account is not activated yet. Please check for an email from us to activate your ExamForge account."
            });
        }
        // check for deactivated account
        if (user?.isActive === 0) {
            return next({
                status: 403,
                severity: "high",
                type: "authentication",
                message: "Your account has been deactivated. Please contact the help desk for guidance on how to reactivate your account."
            });
        }
        // strip off important information
        const { password: psw, created_date, modified_date, ...rest } = user;
        // create a jwt token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.AUTH_SECRET, { expiresIn: '6h' });
        // send out server response
        res.cookie("ExamForge_token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            partitioned: true,
            maxAge: 1000 * 60 * 60 * 6
        })
            .status(200).json(rest);
    }
    catch (error) {
        next({
            status: 500,
            severity: "high",
            type: "authentication",
            message: "Error signing in. Please try again later.",
            error
        });
    }
};
exports.signin = signin;
const signout = (req, res, next) => {
    try {
        res.clearCookie("ExamForge_token").status(200).json({ response: "Your account is signed out successfully." });
    }
    catch (error) {
        next({ status: 500, error });
    }
};
exports.signout = signout;
//# sourceMappingURL=auth.controller.js.map