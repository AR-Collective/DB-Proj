import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const getCompatibleBloodForPatient = async (patientId) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_get_compatible_blood_for_patient(${patientId})`);
        return result;
    } catch (err) {
        throw err;
    }
};

const searchPatientByDisease = async (disease) => {
    try {
        const result = await db.execute(sql`SELECT * FROM fn_search_patients_by_disease(${disease})`);
        return result;
    } catch (err) {
        throw err;
    }
};

export { getCompatibleBloodForPatient, searchPatientByDisease };
