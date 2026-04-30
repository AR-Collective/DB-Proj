import db from '../config/db.js';

const newBloodRequest = async (data) => {
    try {
        const query = `INSERT INTO BloodRequest(PatientID, HospitalID, BloodGroupID, Quantity, PatientDisease, FulfillmentStatus)
                        VALUES (@patientid, @hospitalid, @bloodgroupid, @quantity, @patientdisease, 'Pending')`;

        return await db.query(query, {
            patientid: data.patientid,
            hospitalid: data.hospitalid,
            bloodgroupid: data.bloodgroupid,
            quantity: data.quantity,
            patientdisease: data.patientdisease,
        });
    } catch (err) {
        throw err;
    }
};

const getBloodUnit = async (data) => {
    try {
        const query = `SELECT * FROM BloodUnit BU
                        WHERE BU.BloodGroupID = (
                            SELECT BloodGroupID FROM BloodRequest
                            WHERE RequestID = @requestid
                        );`;

        return await db.query(query, { requestid: data.requestid });
    } catch (err) {
        throw err;
    }
};

const getReqByHospital = async (data) => {
    try {
        const query = `SELECT * FROM BloodRequest
                        WHERE HospitalID = @hospitalid;`;

        return await db.query(query, { hospitalid: data.hospitalid });
    } catch (err) {
        throw err;
    }
};

export {
    getBloodUnit,
    newBloodRequest,
    getReqByHospital,
};
