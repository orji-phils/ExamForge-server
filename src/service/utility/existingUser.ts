import { userDB } from "../../libs/dbConnect"
import { User } from "../../types";

const existingUser = async (columnName: string, userData: string) => {
    const connect = await userDB;

    const [unique] = await connect.query<User[]>(
        `SELECT * FROM Users WHERE ${columnName} = '${userData}'`
    );

    if (unique.length > 0) {
        return true;
    }

    return false;
}

export default existingUser;