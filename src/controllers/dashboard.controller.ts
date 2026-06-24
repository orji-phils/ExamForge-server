import { NextFunction, Request, Response } from "express";
import { jambDB, practiceHistory, userDB } from "../libs/dbConnect";
import { PastQuestion, PracticeType, User } from "../types";

// get data for user's dashboard
const userDashboard = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Users data is:", JSON.stringify(req.user));
    if (!req.user) {
        return next({ status: 401, message: "Please login to fetch your dashboard data." });
    }

    try {
        const userId = req.user.id;
        const practiceConnect = await practiceHistory;
        const userConnect = await userDB;

        const [
            [last],
            [highest],
            [weakest],
            [total],
            [recent],
            [history],
            [activity]
        ] = await Promise.all([
            practiceConnect.query<PracticeType[]>(
                `SELECT score FROM Practices 
                WHERE userId = ? 
                ORDER BY modified_date DESC
                LIMIT 1`, [userId]
            ),
            practiceConnect.query<PracticeType[]>(
                `SELECT score FROM Practices 
                WHERE userId = ? 
                ORDER BY score DESC 
                LIMIT 1`, [userId]
            ),
            practiceConnect.query<PracticeType[]>(
                `SELECT ps.subject, AVG(p.score) as averageScore FROM Practices p 
                JOIN PracticeSubjects ps 
                ON p.id = ps.practiceId 
                WHERE userId = ? 
                GROUP BY ps.subject
                ORDER BY p.score
                LIMIt 1`, [userId]
            ),
            practiceConnect.query<PracticeType[]>(
                `SELECT COUNT(*) as totalPractice FROM Practices 
                WHERE userId = ?`, [userId]
            ),
            practiceConnect.query<PracticeType[]>(
                `SELECT p.*, ps.subject FROM Practices p 
                JOIN PracticeSubjects ps 
                ON p.id = ps.practiceId 
                WHERE userId = ? 
                ORDER BY modified_date LIMIT 5`, [userId]
            ),
            practiceConnect.query<PracticeType[]>(
                `SELECT score, DATE (modified_date) AS date FROM Practices
                WHERE userId = ?
                ORDER BY modified_date ASC`, [userId]
            ),
            userConnect.query<User[]>(
                `SELECT description, actionType, created_date FROM AuditLog
                WHERE performedBy = ?
                LIMIT 5`, [userId]
            )
        ]);


        // send out server response
        res.status(200).json({
            lastScore: last[0]?.score ?? 0,
            highestScore: highest[0]?.score ?? 0,
            weakestPractice: weakest[0] ?? null,
            totalPractice: total[0]?.totalPractice ?? 0,
            recentPractices: recent ?? [],
            practiceHistory: history ?? [],
            recentActivities: activity ?? []
        })
    } catch (error) {
        next({ 
            status: 500, 
            severity: "Critical", 
            type: "Database", 
            message: "Error fetching dashboard data. Please try again later.",
            error 
        });
    }
}

// fetch data for admin dashboard
const adminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin") {
        return next({ status: 403, message: "Please login to your admin account to fetch your dashboard data." });
    }

    try {
        const userConnect = await userDB;
        const questionConnect = await jambDB;

        const allSubjects = ['biology', 'economics'];

        const [
            [user],
            [admin],
            questions,
            [newUsers],
            [recents],
            [recentUCount],
            [recentAUsers],
            recentQCount
        ] = await Promise.all([
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS userCount FROM Users
                WHERE role = 'user'`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS adminCount FROM Users
                WHERE role = 'admin'`
            ),
            allSubjects.map(subject => (
                questionConnect.query<PastQuestion[]>(
                    `SELECT COUNT (*) AS questionCount FROM ??`, [subject]
                )
            )),
            userConnect.query<User[]>(
                `SELECT * FROM Users 
                WHERE NOT role = 'master'
                ORDER BY created_date DESC
                LIMIT 5`
            ),
            userConnect.query<User[]>(
                `SELECT description, actionType, created_date FROM AuditLog
                WHERE actionType IN (
                'Account Creation',
                'Activate Account',
                'Deactivate Account',
                'Delete Account',
                'Questions Uploaded',
                'Questions Deleted',
                'Questions Updated',
'User Update'
                ) ORDER BY created_date DESC
                 LIMIT 5`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS recentUserCount FROM Users
                WHERE created_date >= NOW () - INTERVAL 7 DAY`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (DISTINCT id) AS activeCount  FROM LastActiveTime
                WHERE lastActive >= NOW () - INTERVAL 1 DAY`
            ),
            allSubjects.map(subject => (
                questionConnect.query<PracticeType[]>(
                    `SELECT COUNT (*) AS recentQuestionCount FROM ?? 
                    WHERE created_date >= NOW () - INTERVAL 7 DAY`, [subject]
            )
            ))
        ]);

        // sum up the entire questions
        const allQuestions = await Promise.all(questions);
        const questionCount = allQuestions.reduce((sum, [rows]) => {
            return sum + rows[0].questionCount
        }, 0);

        // sum up the number of recent questions for the past 7 days
        const aq = await Promise.all(recentQCount);
        const qC = aq.reduce((sum, [rows]) => {
            return sum + rows[0]?.recentQuestionCount
        }, 0);

        // get the platform activities
        const platform = [
            `${qC} new questions posted in the last 7 days.`, 
            `${recentAUsers[0]?.activeCount} user engagements today.`, 
            `${recentUCount[0]?.recentUserCount} new users in the last 7 days.`];

        // send out server response
        res.status(200).json({
            userCount: user[0]?.userCount ?? 0,
            adminCount: admin[0]?.adminCount ?? 0,
            questionCount: questionCount ?? 0,
            recentUsers: newUsers ?? [],
            recentActivities: recents ?? [],
            platformActivities: platform 
        });
    } catch (error) {
        next({ 
            status: 500,
            severity: "high",
            type: "database", 
            error });
    }
}

const masterDashboard = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "master") {
        return next({ status: 403, message: "Sorry! only logged in masters can fetch dashboard data." });
    }

    try {
        const userConnect = await userDB;
        const questionConnect = await jambDB;

        const allSubjects = ['biology', 'economics'];

        const [
            [user],
            [admin],
            [master],
            [pendingCount],
            [pending],
            questions,
            [activities],
            [system],
        ] = await Promise.all([
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS userCount FROM Users
                WHERE role = 'user'`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS adminCount FROM Users
                WHERE role = 'admin'`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (*) AS masterCount FROM Users
                WHERE role = 'master'`
            ),
            userConnect.query<User[]>(
                `SELECT COUNT (status) AS countPending FROM accountUpgrade
                WHERE status = 'pending'`
            ),
            userConnect.query<User[]>(
                `SELECT au.*, u.* FROM accountUpgrade au
                JOIN Users U ON
                au.userId = u.id
                WHERE status = 'pending'`
            ),
            allSubjects.map(subject => (
                questionConnect.query<PastQuestion[]>(
                    `SELECT COUNT (*) AS questionCount FROM ??`, [subject]
                )
            )),
            userConnect.query(
                `SELECT al.description, al.actionType, al.created_date FROM AuditLog al 
                JOIN Users u ON al.performedBy = u.id
                WHERE u.role = 'admin'
                ORDER BY created_date DESC
                LIMIT 5`
            ),
            userConnect.query(
                `SELECT * FROM SystemLog`
            )
        ]);

        // sum up the number of uploaded questions
        const allQuestions = await Promise.all(questions);
        const questionCount = allQuestions.reduce((sum, [rows]) => {
            return sum + rows[0].questionCount;
        }, 0)

        // send out server response
        res.status(200).json({
            userCount: user[0]?.userCount ?? 0,
            adminCount: admin[0]?.adminCount ?? 0,
            masterCount: master[0]?.masterCount ?? 0,
            pendingCount: pendingCount[0]?.countPending ?? 0,
            pending: pending ?? [],
            questionCount: questionCount ?? 0,
            adminActivities: activities ?? [],
            systemLogs: system ?? []
        });
    } catch (error) {
        next({ 
            status: 500, 
            severity: "Critical", 
            type: "Database", 
            error });
    }
}

export { userDashboard, adminDashboard, masterDashboard };