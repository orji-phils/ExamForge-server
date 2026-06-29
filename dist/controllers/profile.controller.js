"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.deleteProfile = exports.getProfile = void 0;
const dbConnect_1 = require("../libs/dbConnect");
const createLogs_1 = require("../service/utility/createLogs");
const profile_schema_1 = require("../schemas/profile.schema");
// get user's profile
const getProfile = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "medium",
            type: "unauthorized",
            message: "Please login to attempt fetching your profile"
        });
    }
    try {
        const { id, role } = req.user;
        const connect = await dbConnect_1.userDB;
        // fetch user's profile
        let [userProfile] = await connect.query("SELECT * FROM UserProfile WHERE userId = ?", [id]);
        const profile = userProfile[0];
        // check if user profile exist
        if (!profile) {
            return res.status(404).json({ message: "User profile not found." });
        }
        // fetch admin or master data
        if (role !== "user") {
            const [adminData] = await connect.query("SELECT * FROM AdminProfile WHERE profileId = ?", [profile?.id]);
            // attach admin or master data to the retrieved profile
            userProfile = userProfile.map(prev => ({
                ...prev,
                accountNumber: adminData[0]?.accountNumber,
                bankName: adminData[0]?.bankName
            }));
        }
        // send out server response
        res.status(200).json(userProfile[0]);
    }
    catch (error) {
        next({
            status: 500,
            severity: "critical",
            message: "Error fetching profile. Please try again later.",
            type: "database",
            error
        });
    }
};
exports.getProfile = getProfile;
// delete user's profile
const deleteProfile = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Please login to attempt deleting your profile."
        });
    }
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { id, role } = req.user;
        // fetch user's profile data
        const [retrievedProfile] = await connect.query("SELECT Users.userName, UserProfile.id FROM Users JOIN UserProfile ON users.id = UserProfile.userId WHERE Users.id = ?", [id]);
        // check profile existence
        if (!retrievedProfile.length) {
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: id,
                actionType: "Profile Deletion",
                description: `User with id: ${id} attempted delting none existing profile.`
            });
            return res.status(404).json({ message: "Can't find profile to delete." });
        }
        const profile = retrievedProfile[0];
        await connect.beginTransaction();
        // delete general user profile
        const [deleted] = await connect.query("DELETE FROM UserProfile WHERE userId = ?", [id]);
        if (profile?.role !== "user") {
            await connect.query(`DELETE FROM AdminProfile 
                WHERE profileID = ?`, [deleted.affectedRows]);
        }
        // log the action
        (0, createLogs_1.auditLog)({
            performedBy: id,
            actionType: "Profile Deletion",
            description: `${profile?.userName} deleted their profile data.`
        });
        await connect.commit();
        // send out server response
        res.status(200).json({ message: "Your profile has been deleted successfully." });
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error deleting profile. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.deleteProfile = deleteProfile;
// create or update user's profile
const createProfile = async (req, res, next) => {
    if (!req.user) {
        return next({
            status: 401,
            severity: "high",
            type: "unauthorized",
            message: "Please login to attempt creating your profile."
        });
    }
    const pool = await dbConnect_1.userDB;
    const connect = await pool.getConnection();
    try {
        const { id, role } = req.user;
        const { firstName, lastName, dateOfBirth, phoneNumber, bio, accountNumber, bankName } = profile_schema_1.profileSchema.parse(req.body);
        // check picture path from multer
        let picturePath = "";
        if (req.file) {
            picturePath = req.file.path;
        }
        // get user profile if exist
        const [userProfile] = await connect.query(`SELECT u.userName, up.*, ap.* FROM Users u
            JOIN UserProfile up ON
            u.id = up.userId
            JOIN AdminProfile ap ON
            up.id = ap.profileId
            WHERE up.userId = ?`, [id]);
        const profile = userProfile[0];
        // check if user's profile exist
        await connect.beginTransaction();
        if (profile) {
            // update records for any user type
            await connect.query(`UPDATE UserProfile 
                SET firstName = ?, lastName = ?, dateOfBirth = ?, profilePicture = ?, phoneNumber = ?, bio = ? 
                WHERE UserId = ?`, [firstName, lastName, dateOfBirth, picturePath, phoneNumber, bio, id]);
            // insert admin profile if not available
            if (!profile.accountNumber) {
                await connect.query(`INSERT INTO AdminProfile 
                    (profileId, accountNumber, bankName) 
                    VALUES (?, ?, ?)`, [profile?.id, accountNumber, bankName]);
            }
            // update record for master and admin types if already exists
            role !== "user" &&
                await connect.query(`UPDATE AdminProfile 
            SET accountNumber = ?, bankName = ? 
            WHERE profileId = ?`, [accountNumber, bankName, profile?.id]);
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: id,
                actionType: "Profile Update",
                description: `${profile?.userName} updated their profile information.`
            });
        }
        else {
            // create records for any user type
            const [insertedProfile] = await connect.query(`INSERT INTO UserProfile 
                (userId, firstname, lastName, dateOfBirth, profilePicture, phoneNumber, bio) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, firstName, lastName, dateOfBirth, picturePath, phoneNumber, bio]);
            // Create record for master and admin types
            role !== "user" &&
                await connect.query(`INSERT INTO AdminProfile 
                (accountNumber, bankName, profileId) 
                VALUES (?, ?, ?)`, [accountNumber, bankName, insertedProfile.insertId]);
            // log the action
            (0, createLogs_1.auditLog)({
                performedBy: id,
                actionType: "Profile Creation",
                description: `${userProfile[0]?.userName} created their profile.`
            });
        }
        await connect.commit();
        console.log(JSON.stringify(profile));
        // send out server response
        if (profile) {
            res.status(200).json({ message: "Your profile has been updated successfully." });
        }
        else {
            res.status(201).json({ message: "Your profile has been created successfully." });
        }
    }
    catch (error) {
        await connect.rollback();
        next({
            status: 500,
            severity: "critical",
            type: "database",
            message: "Error creating your profile. Please try again later.",
            error
        });
    }
    finally {
        await connect.release();
    }
};
exports.createProfile = createProfile;
//# sourceMappingURL=profile.controller.js.map