"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnect_1 = require("../../libs/dbConnect");
const existingUser = async (columnName, userData) => {
    const connect = await dbConnect_1.userDB;
    const [unique] = await connect.query(`SELECT * FROM Users WHERE ${columnName} = '${userData}'`);
    if (unique.length > 0) {
        return true;
    }
    return false;
};
exports.default = existingUser;
//# sourceMappingURL=existingUser.js.map