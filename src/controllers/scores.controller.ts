import { NextFunction, Request, Response } from "express";
import { PracticeType, User } from "../types";
import { ResultSetHeader } from "mysql2";
import { practiceHistory, userDB } from "../libs/dbConnect";
import { connect } from "http2";
import { auditLog } from "../service/utility/createLogs";
import { scoreSchema } from "../schemas/scores.schema";

// get the last record id
const getRecordId = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Please login to attempt fetching the history id."
        });
    }

    try {
        const connect = await practiceHistory;
        const userId = req.user.id;

        // attempt to retrieve the last record id in the table
        const [retrievedRecordId] = await connect.query<PracticeType[]>(
            "Select recordId from Practices WHERE userId = ? ORDER BY recordId DESC LIMIT 1", [userId]
        );

        // send out server response
        res.status(200).json(retrievedRecordId[0]?.recordId);
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching practice history id. Please try again later.",
            error 
        });
    }
}

// get all the stored score data for the selected recordId
const getScores = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Please sign in to fetch your score."
        })
    }

    try {
        const connect = await practiceHistory;
        const { userId, recordId } = req.params;

        // attempt to fetch the practice scores data for the specified past question
        const [practiceData] = await connect.query<PracticeType[]>(
            `SELECT p.*, ps.*, pa.* FROM Practices p 
            JOIN PracticeSubjects ps 
            ON p.id = ps.practiceId
            JOIN PracticeAnswers pa
            ON p.id = pa.practiceId
            WHERE recordId = ?
            ORDER BY questionId ASC`, [recordId]
        );

        // check if practice data exist
        if (!practiceData.length) {
            res.status(404).json({ message: "Sorry! The specified practice history wasn't found." });
        }

        // send out server response
        res.status(200).json(practiceData);
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching your score. Please try again later.",
            error 
        });
    }
}

// get the user's practice score information
const getScoreInfo = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Please sign in to get your score info."
        });
    }

    try {
        const { userId, selectedType } = req.params;
        const connect = await practiceHistory;

        // retrieve score recordIdS
        const [recordData] = await connect.query<PracticeType[]>(
            `SELECT
            p.score, p.year, p.created_date, p.modified_date, p.recordId, 
            p.id, p.examType, ps.subject, ps.practiceID 
            FROM Practices p
            JOIN PracticeSubjects ps
            ON p.id = ps.practiceID 
            WHERE p.userId = ? AND p.type = ? 
            ORDER BY p.created_date DESC
            `, [userId, selectedType]
        );
        const data = recordData[0];

        if (!data) {
            return res.status(404).json({ message: `No ${selectedType} practice found.` });
        }

        // send out server response
        res.status(200).json(scoreSchema.parse(recordData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            message: "Error fetching your score info. Please try again later.",
            error 
        });
    }
}

// get the highest or last score data
const getUserLastScore = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Please sign in to fetch your last score." 
        });
    }

    try {
        const { data, id } = req.params;
        const connect = await practiceHistory;

        if (!data || !id) {
            return res.status(400).json({ message: "Invalid request. Please try again." });
        }

        const [scoreData] = await connect.query<PracticeType[]>(
            `SELECT p.*, ps.subject FROM Practices p 
            JOIN PracticeSubjects ps On
            p.id = ps.practiceId
            WHERE userId = ? 
            ORDER BY ? DESC LIMIT 1
            `, [id, data]
        );

        // send out server response
        res.status(200).json(scoreSchema.parse(scoreData));
    } catch (error) {
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: "Error fetching your last score. Please try again.",
            error 
        });
    }
}

// delete user's practice history
const deleteScore = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Please sign in to delete your practice history."
        });
    }

    const { recordId, subject, year } = req.params;
    const pool = await practiceHistory;
    const connect = await pool.getConnection();

    try {
        const userConnect = await userDB;

        // retrieve the practice history.
        const [historyData] = await connect.query<PracticeType[]>(
            `SELECT * FROM Practices
            WHERE  recordId = ?`, [recordId]
        );
        const data = historyData[0];

        const [userData] = await userConnect.query<User[]>(
            `SELECT userName FROM Users 
            WHERE id = ?`, [req.user.id]
        );
        const user = userData[0];

        // check if history exists
        if (!data) {
            // const log the action
            auditLog({
                performedBy: req.user.id!,
                actionType: "Score Deletion",
                description: `${user?.userName} attempted deleting a non existing ${year} ${subject} practice history.`
            });

            return res.status(404).json({ message: `${year} ${subject} practice history not found in your practice history.` });
        }

        await connect.beginTransaction();
        // delete the practice history data
        await connect.query(
            "DELETE FROM Practices WHERE recordId = ?", [recordId]
        );

        // log the action
        auditLog({
            performedBy: req.user.id!,
            actionType: "Score Deletion",
            description: `${user?.userName} deleted their ${year} ${subject} practice history.`
        });
        await connect.commit();

        // send out server response
        res.status(200).json({ message: `Your ${year} ${subject} practice history have been deleted successfully.` });
    } catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: `Error deleting your ${year} ${subject} practice history. Please try again later.`
        });
    } finally {
        await connect.release();
    }
}

// upload user's practice scores
const uploadScores = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next({ 
            status: 401, 
            severity: "high",
            type: "unauthorized",
            message: "Sorry! Please sign in to upload your score."
        })
    }

    const pool = await practiceHistory;
    const connect = await pool.getConnection();
    let data;

    try {
        const scoreData = req.body as PracticeType[];
        const userId = req.user.id;
        const recordId = Number(req.params.recordId);
        const isSimulation = Array.isArray(scoreData[0]?.subjects);
        const userConnect = await userDB;
        data = scoreData[0];

        // get user data
        const [userData] = await userConnect.query<User[]>(
            `SELECT userName FROM Users WHERE id = ?`, [userId]
        );
        const user = userData[0];

        // get the practice data
        const [practiceData] = await connect.query<PracticeType[]>(
            `SELECT p.* FROM Practices p
            JOIN PracticeSubjects ps ON
            p.id = ps.practiceId
            WHERE p.userId = ? AND ps.subject = ? AND p.year = ?`, 
            [userId, data?.subject, data?.year]
        );
        const practice = practiceData[0];

        await connect.beginTransaction();
        if (practice) {
            // update the practices table
            const [updatePractice] = await connect.query<ResultSetHeader>(
                `UPDATE Practices SET score = ? WHERE recordId = ? AND userId = ?`,
                [scoreData[0]?.score, recordId, userId]
            );

            // update the practice answers
            await Promise.all(
                scoreData.map(s => {
                    return connect.query(
                        `UPDATE practiceAnswers SET userAnswer = ? WHERE practiceId = ? AND questionId =?`,
                        [s.userAnswer, s.practiceId, s.questionId]
                    );
                })
            );

            // log the action
            auditLog({
                performedBy: userId!, 
                actionType: "Update Score", 
                description: `${user?.userName} updated their ${practiceData[0]?.year} ${practiceData[0]?.subject} practice history.`
            });
        } else {
            // insert data into practices table
            const [insertPractices] = await connect.query<ResultSetHeader>(
                `INSERT INTO Practices 
                (recordId, userId, score, year, type, examType) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [recordId + 1, userId, data?.score, data?.year, isSimulation ? "simulation" : "single", data?.examType]
            );

            // insert into the answer table
            const insertAnswers = await Promise.all(
                scoreData.map(s =>
                    connect.query<ResultSetHeader>(
                        `INSERT INTO PracticeAnswers 
                        (practiceId, questionId, userAnswer, correctAnswer) 
                        VALUES (?, ?, ?, ?)`,
                        [insertPractices.insertId, s.questionId, s.userAnswer, s.correctAnswer]
                    )
                )
            );

            // insert into the practice subjects table for simulations
            if (isSimulation) {
                if (!data?.subjects) {
                    await connect.rollback();
                    return res.status(404).json({ message: "Simulation subjects not found. Please try again." });
                }

                await Promise.all(
                    data.subjects.map(s => {
                        return connect.query(
                            `INSERT INTO PracticeSubjects 
                            (practiceId, subject) VALUES (?, ?)`,
                            [insertPractices.insertId, s]
                        );
                    })
                );
            } else {
                await connect.query(
                    `INSERT INTO PracticeSubjects
                    (practiceId, subject) 
                    VALUES (?, ?)`, 
                    [insertPractices.insertId, data?.subject]
                );
            }

            // log the action
            auditLog({
                performedBy: userId!, 
                actionType: "Upload Score", 
                description: `You completed your ${data?.year} ${data?.subject} with the score ${data?.score}.`
            });
        }
        await connect.commit();

        // send out server response
        if (practice) {
            res.status(200).json({ message: `Your ${data?.year} ${data?.subject} scores have been updated successfully.` });
        } else {
            res.status(201).json({ message: "Your scores have been recorded and stored securely." });
        }
} catch (error) {
        await connect.rollback();
        next({ 
            status: 500, 
            severity: "critical",
            type: "database",
            message: `Error uploading your ${data?.year} ${data?.subject} practice. Please try again later.`,
            error 
        });
    } finally {
        await connect.release();
    }
};

export { getRecordId, getScoreInfo, getScores, getUserLastScore, deleteScore, uploadScores };