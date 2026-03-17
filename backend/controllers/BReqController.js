const { newBloodRequest } = require('../models/bloodreq.js')

const insertBloodRequest = async (req,res) => {
    try{
        const breqdata = req.body;

        if (!breqdata.patientid || !breqdata.hospitalid || !breqdata.bloodgroupid || !breqdata.quantity){
            return res.status(400).json({message: "Data is missing"});
        }

        await newBloodRequest(breqdata);

        res.status(201).json({
            message: "Insertion successful!"
        })
    }
    catch(error)
    {
        console.error("Blood Request Insertion Error: ", error);
        res.status(500).json({
            message: "Insertion failed due to an internal server error",
            error: error.message
        });
    }
}

module.exports = {
    insertBloodRequest
    //getRequestsByHospital,
    //fulfillRequest
}
