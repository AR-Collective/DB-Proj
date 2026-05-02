import db from '../config/db.js';
import { sql } from 'drizzle-orm';

export const getUserByEmail = async (email) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_user_by_email(${email})`);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        throw err;
    }
};

export const getUserRoles = async (userId) => {
    try {
        const result = await db.execute(
            sql`SELECT Role FROM UserRole WHERE UserID = ${userId}`
        );
        return result.map((row) => row.role);
    } catch (err) {
        throw err;
    }
};

export const registerUserModel = async (data) => {
    try {
        const existingUser = await getUserByEmail(data.email);
        let userId;

        if (!existingUser) {
            const result = await db.execute(sql`
            Select * FROM fn_add_user_wth_role( 
                        ${data.firstName}, ${data.lastName}, ${data.email}, ${data.password}, 
                        ${data.contact}, ${data.gender || null}, ${data.lastLogin}, ${data.role})`);
            userId = result[0].userid;
            return { userId, result }
        }
        userId = existingUser.userid;

        const result = await db.execute(sql`SELECT fn_add_role(${userId}, ${data.role}) AS role_added`);
        const roleAdded = result[0].role_added;

        if (!roleAdded) {
            const error = new Error('A user with this email and role already exists.');
            error.code = 'ROLE_EXISTS';
            throw error;
        }

        return {
            userId: userId,
            isNewUser: false,
            user: existingUser
        };
    } catch (err) {
        throw err;
    }
};

