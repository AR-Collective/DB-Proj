import sql from 'mssql'


const newBloodRequest = async(data) => {
    try{
        // const now = new Date()

        const query =  `INSERT INTO BloodRequest(PatientID, HospitalID, BloodGroupID, Quantity, PatientDisease, FulfillmentStatus)
                        VALUES (@patientid, @hospitalid, @bloodgroupid, @quantity, @patientdisease, 'Pending')`;
        const request = new sql.Request();
        request.input('patientid', sql.VarChar, data.patientid);
        request.input('hospitalid', sql.INT, data.hospitalid);
        request.input('bloodgroupid', sql.INT, data.bloodgroupid);
        request.input('quantity', sql.INT, data.quantity);
        request.input('patientdisease', sql.VarChar, data.patientdisease);
        // request.input('requestdate', sql.DateTime, now);
        //request.input('fulfillmentstatus', sql.VarChar, data.fulfillmentstatus);

        return await request.query(query);
    } catch(err) {
        throw err
    }
}

const getBloodUnit = async(data) => {
    try{
        const query =  `SELECT * FROM BloodUnit BU
                        WHERE BU.BloodGroupID = (
                            SELECT BloodGroupID FROM BloodRequest
                            WHERE RequestID = @requestid
                        );`;
        // maybe add Status = 'Available' later
        const request = new sql.Request();
        request.input('requestid', sql.INT, data.requestid);

        return await request.query(query);
    }
    catch(err){
        throw err;
    }
}

const getReqByHospital = async(data) => {
    try{
        const query =  `SELECT * FROM BloodRequest
                        WHERE HospitalID = @hospitalid;`;

        const request = new sql.Request();
        request.input('hospitalid',sql.INT, data.hospitalid);

        return await request.query(query);
    }
    catch(err)
    {
        throw err;
    }
}

export{
    getBloodUnit,
    newBloodRequest,
    getReqByHospital
}
