const sql = require('mssql')

const newBloodRequest = async(data) => {
    try{
        const now = new Date()

        const query =  'INSERT INTO BloodRequest(PatientID, HospitalID, BloodGroupID, Quantity, PatientDisease, RequestDate, FulfillmentStatus)
                        VALUES (@patientid, @hospitalid, @bloodgroupid, @quantity, @patientdisease, @requestdate, @fulfillmentstatus)';
        const request = new sql.Request();
        request.input('patientid', sql.VarChar, data.patientid);
        request.input('hospitalid', sql.INT, data.hospitalid);
        request.input('bloodgroupid', sql.INT, data.bloodgroupid);
        request.input('quantity', sql.INT, data.quantity);
        request.input('patientdisease', sql.VarChar, data.patientdisease);
        request.input('requestdate', sql.DateTime, now);
        request.input('fulfillmentstatus', sql.VarChar, data.fulfillmentstatus);

        await request.query(query);
    }
    } catch(err) {
        throw err
    }
} 
