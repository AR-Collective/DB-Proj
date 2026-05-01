import db from '../config/db.js';
import { hashPassword } from '../utils/hash_password.js';

// Step 1: Check email and get available roles
const checkEmailAndGetRoles = async (email) => {
    try {
        const result = await db.queryClient`
            SELECT * FROM fn_get_available_roles(${email})
        `;
        
        if (!result || result.length === 0) {
            throw new Error('No result from role check');
        }
        
        const row = result[0];
        
        return {
            isNewEmail: row.userid === null,
            userId: row.userid,
            existingRoles: row.existingroles || [],
            availableRoles: row.availableroles || ['Donor', 'Patient', 'Staff']
        };
    } catch (err) {
        throw err;
    }
};

// Step 3: Complete registration with all details
const completeRegistration = async (email, selectedRole, firstName, lastName, contact, gender, password) => {
    try {
        const hashedPassword = await hashPassword(password);
        
        const result = await db.queryClient`
            SELECT * FROM fn_register_or_add_role(
                ${email},
                ${selectedRole},
                ${firstName},
                ${lastName},
                ${contact},
                ${gender},
                ${hashedPassword}
            )
        `;
        
        if (!result || result.length === 0) {
            throw new Error('Registration failed');
        }
        
        return result[0];
    } catch (err) {
        throw err;
    }
};

export { checkEmailAndGetRoles, completeRegistration };
