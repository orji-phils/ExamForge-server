import { NextFunction, Request, Response } from "express";
import { PracticeType, User } from "../types";
import { spreadData } from "../service/utility/structureQuestion";
import { RowDataPacket } from "mysql2";
import { userDB } from "../libs/dbConnect";
import { auditLog } from "../service/utility/createLogs";
import { multiExamTypeSchema, MultiQuestionForm, multiQuestionSchema, multiSubjectSchema, multiYearSchema, questionFieldSchema, QuestionForm } from "../schemas/question.schema";

type DatabaseType = RowDataPacket & { Database: string };
type YearType = RowDataPacket & { year: number };

// get all the database names as the exam type
const getDatabases = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connect = await req.connect;

        // fetch all supported databases
        const [fetchDatabases] = await connect.query<DatabaseType[]>(
            "SHOW DATABASES"
        );

        // remove irrelevant databases
        const irrelevantDBs = [
  "information_schema",
  "test",
  "user",
  "practicehistory",
  "mysql", 
  "performance_schema", 
  "phpmyadmin"
];

// extract the db postfix from the database name
        const relevantDBs = fetchDatabases
        .map(db => {
            const dbIndex = db.Database.search("db");
            const dbName = dbIndex !== -1 ? db.Database.slice(0, dbIndex) : db.Database;
            return dbName;
        }) // remove unwanted database names
        .filter(dbName => !irrelevantDBs.includes(dbName.toLowerCase()));

        if (!relevantDBs.length) {
            // log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "Invalid Exam Type",
                description: `User with id: ${req.user.id} failed to get a valid exam type.`
            });

            return res.status(404).json({ message: "No Exam type available for now. Please check back later." });
        }

        // send out server response
        res.status(200).json(multiExamTypeSchema.parse(relevantDBs));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching exam type. Please try again later.",
            error 
        });
    }
}

// get all the tables as the supported subjects
const getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connect = await req.connect;

        // fetch all tables for the respective database connection
        const [fetchTables] = await connect.query<DatabaseType[]>(
            "SHOW TABLES"
        );

        const allTables = fetchTables.map(table => Object.values(table)[0]);

        if (!allTables.length) {
            // log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "Empty Subject",
                description: `User with id: ${req.user.id} failed to fetch supported subjects.`
            });
            return res.status(404).json({ message: "No subject/course available for now. Please check back later." });
        }

        // send out server response
        res.status(200).json(multiSubjectSchema.parse(allTables));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching supported subjects. Please try again later.",
            error });
    }
}

// get distinct years of a subjects
const getYears = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subject = req.params.subject;
        const connect = await req.connect;

        const [years] = await connect.query<YearType[]>(
            "SELECT DISTINCT year FROM ?? ORDER BY year ASC", [subject]
        );

        const allYears = years.map(y => y.year);

        // if (!allYears.length) {
            // log the action
            // auditLog({
                // performedBy: req.user.id!,
                // actionType: "No Questions",
                // description: `User with id: ${req.user.id} failed to fetch ${subject} past questions.`
            // });

            // return res.status(404).json({ message: `No question found for ${subject}. Please try again later.`});
        // }

        // send out server response
        res.status(200).json(multiYearSchema.parse(allYears));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching past question years. Please try again later.",
            error });
    }
}

// get past questions using the id to the question
const getPastQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Please log in to fetch questions from your practice history."
        });
    }

    try {
        const allScoreData: PracticeType[] = req.body;
        const connect = await req.connect;

        const ids = allScoreData.map(data => data.questionId);
        const placeHolders = ids.map(() => "?").join(",");

        // attempt to retrieve all past question using their IDs
        const [questions] = await connect.query<QuestionForm[]>(
            `SELECT * FROM ?? 
            Where id in (${placeHolders})
            ORDER BY questionNumber ASC`, [allScoreData[0]?.subject, ...ids]
        );

        if (!questions) {
            // log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "No Questions",
                description: `User with id: ${req.user.id} failed to fetch questions from their practice history.`
            });

            return res.status(404).json({ message: "History questions not found. Please try again later." });
        }

        // send out server response
        res.status(200).json(multiQuestionSchema.parse(questions));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching questions from practice history. Please try again later.",
            error });
    }
}

// get random questions for past question similations
const getRandomQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(JSON.stringify(req.params));
        const subject = req.params.subjects;
        const subjects = subject?.split(",");
        const connect = await req.connect;

        if (!subjects) {
            return res.status(400).json({ message: "Sorry! Please select your subjects for practice" });
        }

        // get random questions for the selected subjects
        const queries = subjects.map(subject =>  connect.query<QuestionForm[]>(
            `SELECT * FROM ??
            WHERE id >= FLOOR(RAND() * 
            (SELECT MAX(id) FROM ??))
            LIMIT 50`, [subject, subject]
        ));
        const questions = await Promise.all(queries);
        const randomQuestions = questions.flatMap(([rows]) => rows);

        // get the subject names
        let subjectNames;
        subjects.map(name => {
            subjectNames = name + ", "
        });

        if (!randomQuestions.length) {
            // log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "No Questions",
                description: `User failed to fetch ${subjectNames} for their practice.`
            });

            return res.status(404).json({ message: "Sorry! Questions are not yet uploaded for the specified subjects. Please check back later" });
        }

        // send out server response
        res.status(200).json(multiQuestionSchema.parse(randomQuestions));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching random questions. Please try again later.",
            error 
        });
    }
}

// get all past questions with the same year and subject.
const getPastQuestionByYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { year, subject } = req.params;
        const connect = await req.connect;

        // fetch the expected past question
        const [pastQuestion] = await connect.query<QuestionForm[]>(
            `SELECT * FROM ?? WHERE year = ? ORDER BY questionNumber ASC`, [subject, year]
        );

        // send out server response
        res.status(200).json(multiQuestionSchema.parse(pastQuestion));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: `Error fetching ${req.params.year} ${req.params.subject} past questions. Please try again later.`,
            error 
        });
    }
}

// delete all of the past question with the same year and subject.
const deletePastQuestion = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === "user") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Admin or master privilege required to delete past questions." 
        });
    }

    const pool = await req.connect;
    const connect = await pool.getConnection();

    try {
        const userConnect = await userDB;
        const { subject, year } = req.params;

        // get deleters data
        const [deleter] = await userConnect.query<User[]>(
            `SELECT userName FROM Users 
            WHERE id = ?`, [req.user.id]
        );
        const user = deleter[0];

        // check if question exists
        const [existingQuestions] = await connect.query<QuestionForm[]>(
            "SELECT * FROM ?? WHERE year = ?", [subject, year]
        );
        if (!existingQuestions.length) {
            // log the action
        auditLog({
            performedBy: req.user.id!, 
            actionType: "Questions Deleted", 
            description: `${user?.userName} attempted deleting a none existing ${year} ${subject} past question.`
        });

        return res.status(404).json({ message: "Failed to delete! Question not found" });
        }

        await connect.beginTransaction();
        // attempt to delete all past questions with the same year and subject
        await connect.query(
            "DELETE FROM ?? WHERE year = ?", [subject, year]
        );

        // log the action
        auditLog({
            performedBy: req.user.id!, 
            actionType: "Questions Deleted", 
            description: `${user?.userName} deleted ${year} ${subject} past question.`
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `${year} ${subject} past question has been deleted successfully.` });
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: `Error deleting ${req.params.year} ${req.params.subject} past questions. Please try again later.`,
            error 
        });
    } finally {
        await connect.release();
    }
}

// create new or update existing past question
const uploadPastQuestion = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === "user") {
        return next({ 
            status: 403, 
            severity: "high",
            type: "unauthorized",
            message: "Admin or master privilege required to upload past questions." });
    }

    const pool = await req.connect;
    const connect = await pool.getConnection();

    try {
        const { subject, year } = questionFieldSchema.parse(req.params);
        const sentQuestions: MultiQuestionForm = multiQuestionSchema.parse(await spreadData(req, res, next));
        const userConnect = await userDB;

        // get uploader detail
        const [uploader] = await userConnect.query<User[]>(
            `SELECT userName, id FROM Users 
            WHERE id = ?`, [req.user.id]
        );
        const user = uploader[0];

        if (!sentQuestions.length) {
            // log the action
        auditLog({
            performedBy: user?.id!, 
            actionType: "Questions uploaded", 
            description: `${user?.userName} failed to upload past questions in the correct format.`
        });

            return res.status(400).json({ message: "Please upload questions in the required format." });
        }

        // retrieve the questions if they exist
        const [existingQuestions] = await connect.query<QuestionForm[]>(
            `SELECT id FROM ?? 
            WHERE year = ?`, [subject, year]
        );

        if (existingQuestions.length && sentQuestions.length !== existingQuestions.length) {
            return res.status(400).json({ message: "Sorry! Number of questions does not match existing database records." });
        }

        await connect.beginTransaction();
        if (existingQuestions.length) {
            // attempt to update the stored questions
            const updatedPastQuestions = sentQuestions.map(async (question, index) => {
                return connect.query(
                    `UPDATE ?? SET 
                    questionNumber = ?, question = ?, options = ?, correctAnswer = ?, year = ?, subject = ? 
                    WHERE id = ?`,
                    [subject, question.questionNumber, question.question, JSON.stringify(question.options), question.correctAnswer, year, subject, existingQuestions[index]?.id]
                );
            });
            await Promise.all(updatedPastQuestions);

            // log the action
            auditLog({
                performedBy: user?.id!, 
                actionType: " Questions Updated", 
                description: `${user?.userName} updated ${year} ${subject} past question.`
            });
        } else {
            // attempt uploading the past question
            const uploadedQuestions = sentQuestions.map(question => {
                return connect.query(
                    `INSERT INTO ?? 
                    (questionNumber, question, options, correctAnswer, year, subject) 
                    VALUES(?, ?, ?, ?, ?, ?)`,
                    [subject, question.questionNumber, question.question, JSON.stringify(question.options), question.correctAnswer, year, subject]
                );
            });
            await Promise.all(uploadedQuestions);

            // log the action
            auditLog({
                performedBy: user?.id!, 
                actionType: "Questions uploaded", 
                description: `${user?.userName} uploaded ${year} ${subject} past question.`
            });
        }
        await connect.commit();

        // send out server response
        if (existingQuestions.length) {
            res.status(200).json({ message: `${year} ${subject} past question has been updated successfully.` });
        } else {
            res.status(201).json({ message: `${year} ${subject} past question has been uploaded successfully.` });
        }
    } catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: `Error uploading ${req.params.year} ${req.params.subject} past questions. Please try again later.`,
            error 
        });
    } finally {
        await connect.release();
    }
}

export { getDatabases, getTables, getYears, getPastQuestionByYear, getPastQuestionById, getRandomQuestions, deletePastQuestion, uploadPastQuestion };