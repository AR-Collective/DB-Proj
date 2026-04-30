import db from '../config/db.js';

export const getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            'SELECT * FROM UserAccount WHERE Email = @email',
            { email }
        );
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
};

export const getUserRoles = async (userId) => {
    try {
        const result = await db.query(
            'SELECT Role FROM UserRole WHERE UserID = @userid',
            { userid: userId }
        );
        return result.recordset.map((row) => row.Role);
    } catch (err) {
        throw err;
    }
};

export const registerUserModel = async (data) => {
    try {
        const existingUser = await getUserByEmail(data.email);
        let userId;

        if (!existingUser) {
            const query = `
                INSERT INTO UserAccount (FirstName, LastName, Email, Password, Contact, Gender, LastLogin, Status)
                OUTPUT INSERTED.UserID
                VALUES (@firstName, @lastName, @email, @password, @contact, @gender, @lastLogin, @status)
            `;

            const result = await db.query(query, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                contact: data.contact,
                gender: data.gender || null,
                lastLogin: data.lastLogin,
                status: 'Active'
            });

            userId = result.recordset[0].UserID;
        } else {
            userId = existingUser.UserID;
        }

        const roleCheck = await db.query(
            'SELECT 1 FROM UserRole WHERE UserID = @userid AND Role = @role',
            { userid: userId, role: data.role }
        );

        if (roleCheck.recordset.length > 0) {
            const error = new Error('A user with this email and role already exists.');
            error.code = 'ROLE_EXISTS';
            throw error;
        }

        await db.query(
            'INSERT INTO UserRole (UserID, Role) VALUES (@userid, @role)',
            { userid: userId, role: data.role }
        );

        return { userId, existingUser };
    } catch (err) {
        throw err;
    }
};

export const loginUserModel = async (email) => {
    try {
        const result = await db.query(
            'SELECT * FROM UserAccount WHERE Email = @email',
            { email }
        );
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
};

