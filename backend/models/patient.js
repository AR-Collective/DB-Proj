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

const registerPatientModel = async (userId, age, bloodType, hospitalId, disease) => {
    try {
        // Query for matching blood group
        let bgResult = await db.execute(sql`SELECT BloodGroupID FROM BloodGroup WHERE BloodType = ${bloodType}`);
        // Query for matching hospital
        let hospResult = await db.execute(sql`SELECT HospitalID FROM Hospital WHERE HospitalID = ${hospitalId}`);

        // Handle Result object - extract bloodGroupId (lowercase from API)
        let bloodGroupId;
        if (bgResult && bgResult.length > 0) {
            bloodGroupId = bgResult[0]?.bloodgroupid || bgResult[0]?.BloodGroupID;
        }
        
        if (!bloodGroupId) {
            throw new Error('Invalid blood type: ' + bloodType);
        }

        // Handle Result object - extract hospitalId (lowercase from API)
        let hospitalIdFromDb;
        if (hospResult && hospResult.length > 0) {
            hospitalIdFromDb = hospResult[0]?.hospitalid || hospResult[0]?.HospitalID;
        }

        if (!hospitalIdFromDb) {
            throw new Error('Invalid hospital ID: ' + hospitalId);
        }

        const result = await db.execute(sql`
            INSERT INTO Patient (PatientID, Age, BloodGroupID, HospitalID, Disease)
            VALUES (${userId}, ${age}, ${bloodGroupId}, ${hospitalIdFromDb}, ${disease})
            RETURNING *`);
        
        return result[0];
    } catch (err) {
        throw err;
    }
};


export { getCompatibleBloodForPatient, searchPatientByDisease, registerPatientModel };
