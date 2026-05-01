import db from '../config/db.js';

const getCompatibleBloodForPatient = async (patientId) => {
    try {
        return await db.queryClient`SELECT * FROM fn_get_compatible_blood_for_patient(${patientId})`;
    } catch (err) {
        throw err;
    }
};

const searchPatientByDisease = async (disease) => {
    try {
        return await db.queryClient`SELECT * FROM fn_search_patients_by_disease(${disease})`;
    } catch (err) {
        throw err;
    }
};

export { getCompatibleBloodForPatient, searchPatientByDisease };
