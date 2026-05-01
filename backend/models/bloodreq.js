import db from '../config/db.js';
import {sql} from 'drizzle-orm';


const newBloodRequest = async (data) => {
    try {
        const result = await db.transaction(async(tx)=>{
            const res = await tx.execute(sql`
                    CALL sp_create_blood_request(
                    ${data.patientid},
                    ${data.hospitalid},
                    ${data.bloodgroupid},
                    ${data.quantity},
                    ${data.patientdisease}
                )`
            );
            //return res[0];
            
        });
        //return result;
        return {success:true};
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
