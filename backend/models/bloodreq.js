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
       const result = await db.execute(
            sql`SELECT * FROM fn_get_matching_units(${data.requestid})`
        );
        
        return result;

    } catch (err) {
        throw err;
    }
};

const getReqByHospital = async (data) => {
    try {
        const query = await db.execute(
            sql`SELECT * FROM fn_get_requests_by_hospital(${data.hospitalid})`
        );

        return query;
    } catch (err) {
        throw err;
    }
};

const fulfillRequestm = async (data) => {
    try {
        await db.execute(sql`
            CALL sp_fulfill_request(
                ${data.requestid},
                ${data.unitid}
            )`);

        return { success: true };
    } catch (error) {
        throw error;
    }
};

export {
    getBloodUnit,
    newBloodRequest,
    getReqByHospital,
    fulfillRequestm
};
