import db from '../config/db.js';
import { sql } from 'drizzle-orm';

export const getUserByEmail = async (email) => {
    try {
        const result = await db.execute(
            sql`SELECT * FROM UserAccount WHERE Email = ${email}`
        );
        return result[0];
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
                INSERT INTO UserAccount (
                    FirstName, LastName, Email, Password, 
                    Contact, Gender, LastLogin, Status
                )
                VALUES (
                    ${data.firstName}, ${data.lastName}, ${data.email}, ${data.password}, 
                    ${data.contact}, ${data.gender || null}, ${data.lastLogin}, 'Active'
                )
                RETURNING UserID
            `);


            userId = result[0].userid;
        } else {
            userId = existingUser.userid;
        }

        const roleCheck = await db.execute(
            sql`SELECT 1 FROM UserRole WHERE UserID = ${userId} AND Role = ${data.role}`
        );

        if (roleCheck.length > 0) {
            const error = new Error('A user with this email and role already exists.');
            error.code = 'ROLE_EXISTS';
            throw error;
        }

        await db.execute(
            sql`INSERT INTO UserRole (UserID, Role) VALUES (${userId}, ${data.role})`
        );

        return { userId, existingUser };
    } catch (err) {
        throw err;
    }
};

export const loginUserModel = async (email) => {
    try {
        const result = await db.execute(
            sql`SELECT * FROM UserAccount WHERE Email = ${email}`
        );
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
};

