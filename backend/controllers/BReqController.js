import { newBloodRequest, getBloodUnit, getReqByHospital, fulfillRequestm, getAllRequests as fetchAllRequests } from '../models/bloodreq.js'

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

const getBloodUnits = async (req, res) => {
    try{
        const {breqid} = req.query

        if (!breqid){
            return res.status(400).json({message: "Blood Request ID is missing"});
        }
        const result = await getBloodUnit({requestid: breqid});
        res.status(200).json({
            message: "BloodUnit get is successful!",
            data: result
        })
    }
    catch(error)
    {
        console.error("Blood Unit get error: ", error);
        res.status(500).json({
            message: "Getting blood unit failed due to an internal server error",
            error: error.message
        });
    }
}
const getRequestsByHospital = async (req,res)=> {
    try {
        const {hospitalid} = req.query

        if (!hospitalid)
    {
            return res.status(400).json({message: "Hospital ID is missing"});
        }
        const result = await getReqByHospital({hospitalid:hospitalid});
        res.status(200).json({
            message: "BloodRequest get is successful",
            data: result
        })
    }
    catch(error)
{
        console.error("BloodRequest get error: ", error);
        res.status(500).json({
            message: "Getting Blood Request failed due to an internal server error",
            error: error.message
        });
    }
}

const fulfillRequest = async (req, res) => {
    try {
        const { requestid, unitid } = req.body;

        if (!requestid || !unitid) {
            return res.status(400).json({ message: "Request ID or Unit ID is missing" });
        }

        await fulfillRequestm({ requestid, unitid });
        return res.status(200).json({
            message: "Fulfilled Blood Request",
            success:true
        })
    }
    catch(error)
    {
        console.error("Fulfillment request error:",error)
        return res.status(500).json({
                    message: "Internal server error",
                    error: error.message
        });
    }
}

const getAllRequests = async (req, res) => {
    try {
        const result = await fetchAllRequests();
        res.status(200).json({
            message: "All blood requests retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("GetAllRequests error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


export {
    insertBloodRequest,
    getBloodUnits,
    getRequestsByHospital,
    fulfillRequest,
    getAllRequests
}
