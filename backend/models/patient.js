import db from '../config/db.js';

const getCompatibleBloodForPatient = async (patientId) => {
    try {
        return await db.query('SELECT * FROM fn_get_compatible_blood_for_patient($1)', [patientId]);
    } catch (err) {
        throw err;
    }
};

const searchPatientByDisease = async (disease) => {
    try {
        return await db.query('SELECT * FROM fn_search_patients_by_disease($1)', [disease]);
    } catch (err) {
        throw err;
    }
};

export { getCompatibleBloodForPatient, searchPatientByDisease };
