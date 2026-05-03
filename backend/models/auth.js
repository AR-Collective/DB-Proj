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
export const handleRegistrationDbError = (err) => {
    const errorCode = err.code || (err.cause && err.cause.code);

    let customError;
    switch (errorCode) {
        case '23505': // unique_violation
            customError = new Error('A user with this email or contact already exists.');
            customError.statusCode = 409; // Conflict
            throw customError;
        case '23502': // not_null_violation
            customError = new Error('A required field is missing. Please check your inputs, blood type, and related references.');
            customError.statusCode = 400; // Bad Request
            throw customError;
        case '23503': // foreign_key_violation
            customError = new Error('Invalid database reference. The specified blood group or hospital may not exist.');
            customError.statusCode = 400;
            throw customError;
        case '22001': // string_data_right_truncation
            customError = new Error('One of the provided values exceeds the allowed character limit.');
            customError.statusCode = 400;
            throw customError;
        case '22007': // invalid_datetime_format
            customError = new Error('Invalid timestamp provided for last login.');
            customError.statusCode = 400;
            throw customError;
        default:
            throw err; // Rethrow generic errors (will become 500s)
    }
};

export const registerDonorModel = async (fname, lname, email, password, contact, gender, lastLogin, age, bloodType) => {
    try {
        let bgResult = await db.execute(sql`SELECT BloodGroupID FROM BloodGroup WHERE BloodType = ${bloodType}`);

        let bloodGroupId = bgResult[0]?.bloodgroupid || bgResult[0]?.BloodGroupID || null;
        const result = await db.execute(sql`
        SELECT * FROM fn_add_donor(
            ${fname}::VARCHAR, 
            ${lname}::VARCHAR, 
            ${email}::VARCHAR, 
            ${password}::VARCHAR, 
            ${contact}::VARCHAR, 
            ${gender || null}::bpchar(1), 
            ${lastLogin}::TIMESTAMP, 
            ${age}::INT, 
            ${bloodGroupId}::INT
        )
    `);

        const userRow = result[0];

        return {
            userId: userRow.userid,
            existingUser: userRow
        };
    } catch (err) {
        handleRegistrationDbError(err);
    }
};
export const registerPatientModel = async (fname, lname, email, password, contact, gender, lastLogin, age, bloodType, hospitalId, disease) => {
    try {
        // Look up BloodGroupID
        let bgResult = await db.execute(sql`SELECT BloodGroupID FROM BloodGroup WHERE BloodType = ${bloodType}`);
        let bloodGroupId = bgResult[0]?.bloodgroupid || bgResult[0]?.BloodGroupID || null;

        // Look up HospitalID
        let hospResult = await db.execute(sql`SELECT HospitalID FROM Hospital WHERE HospitalID = ${hospitalId}`);
        let hospitalIdFromDb = hospResult[0]?.hospitalid || hospResult[0]?.HospitalID || null;

        const result = await db.execute(sql`
        SELECT * FROM fn_add_patient(
            ${fname}::VARCHAR, 
            ${lname}::VARCHAR, 
            ${email}::VARCHAR, 
            ${password}::VARCHAR, 
            ${contact}::VARCHAR, 
            ${gender || null}::bpchar(1), 
            ${lastLogin}::TIMESTAMP, 
            ${age}::INT, 
            ${bloodGroupId}::INT,
            ${hospitalIdFromDb}::INT,
            ${disease}::VARCHAR
        )
    `);

        const userRow = result[0];

        return {
            userId: userRow.userid,
            existingUser: userRow
        };
    } catch (err) {
        handleRegistrationDbError(err);
    }
};

// export const registerDonorModel = async (userId, age, bloodType) => {
//     try {
//         // Query for matching blood group
//         let bgResult = await db.execute(sql`SELECT BloodGroupID FROM BloodGroup WHERE BloodType = ${bloodType}`);
//
//         // Handle Result object - extract bloodGroupId (lowercase from API)
//         let bloodGroupId;
//         if (bgResult && bgResult.length > 0) {
//             bloodGroupId = bgResult[0]?.bloodgroupid || bgResult[0]?.BloodGroupID;
//         }
//
//         if (!bloodGroupId) {
//             throw new Error('Invalid blood type: ' + bloodType);
//         }
//
//         const result = await db.execute(sql`
//             INSERT INTO Donor (DonorID, Age, BloodGroupID)
//             VALUES (${userId}, ${age}, ${bloodGroupId})
//             RETURNING *
//         `);
//
//         return result[0];
//     } catch (err) {
//         throw err;
//     }
// };
