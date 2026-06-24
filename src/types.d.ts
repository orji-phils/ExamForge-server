import { Request } from "express";
import { Pool, RowDataPacket } from "mysql2";
import { connectDatabase } from "./libs/dbConnect";
import { JwtPayload } from "jsonwebtoken";
import { number } from "zod";

declare module "express-serve-static-core" {
    interface Request {
        connect: ReturnType<typeof connectDatabase>;
        user: JwtPayload & {
            id?: number
            role: string;
        };
    }
}

// user type
type User = RowDataPacket & {
    id: number;
    email: string;
    userName: string;
    password: string;
}

// types for the exam past question
type PastQuestion = Null | RowDataPacket & {
    id?: number;
    questionNumber: number;
    question: string;
    options: { [key: string]: string };
    correctAnswer: string;
};

// practice score type
type PracticeType = RowDataPacket & {
    practiceId: number;
    questionId: number;
    recordId: number;
    userId: number;
    year: number;
    score: number;
    subject: string;
    subjects: string[];
    examType: string;
    userAnswer: string;
    correctAnswer: string;
};

// profile type
type Profile = RowDataPacket & {
    id: number;
    accountType: string;
    firstName: string;
    lastName: string;
    userName: string;
    profilePicture: string;
    phoneNumber: number;
    email: string;
    accountNumber?: number;
    bankName?: string;
    dateOfBirth: string;
};

type Upgrade = RowDataPacket & {
    userId: number;
    status: "approved" | "pending" | "rejected" | "revoked";
    request_date?: string;
    response_date?: string;
}

export { Request, User, PastQuestion, PracticeType, Profile, Upgrade };