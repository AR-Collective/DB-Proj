import { getCompatibleBloodForPatient, searchPatientByDisease, registerPatientModel } from '../models/patient.js'
import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const getCompatibleBlood = async (req, res) => {
    try {
        const { patientid } = req.body

        if (!patientid) {
            return res.status(400).json({ message: "Patient ID is required" })
        }

        const result = await getCompatibleBloodForPatient(patientid)

        res.status(200).json({
            message: "Compatible blood retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get compatible blood error: ", error)
        res.status(500).json({
            message: "Failed to retrieve compatible blood",
            error: error.message
        })
    }
}

const searchByDisease = async (req, res) => {
    try {
        const { disease } = req.body

        if (!disease) {
            return res.status(400).json({ message: "Disease search term is required" })
        }

        const result = await searchPatientByDisease(disease)

        res.status(200).json({
            message: "Patient search successful",
            data: result
        })
    } catch (error) {
        console.error("Search patient by disease error: ", error)
        res.status(500).json({
            message: "Failed to search patients",
            error: error.message
        })
    }
}

const getBloodGroups = async (req, res) => {
    try {
        const result = await db.execute(sql`SELECT * FROM BloodGroup ORDER BY BloodType`)

        res.status(200).json({
            message: "Blood groups retrieved successfully",
            data: Array.from(result)
        })
    } catch (error) {
        console.error("Get blood groups error: ", error)
        res.status(500).json({
            message: "Failed to retrieve blood groups",
            error: error.message
        })
    }
}

const getHospitals = async (req, res) => {
    try {
        const result = await db.execute(sql`SELECT * FROM Hospital ORDER BY name`)

        res.status(200).json({
            message: "Hospitals retrieved successfully",
            data: Array.from(result)
        })
    } catch (error) {
        console.error("Get hospitals error: ", error)
        res.status(500).json({
            message: "Failed to retrieve hospitals",
            error: error.message
        })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const patientId = req.user?.userid;
        if (!patientId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await db.execute(sql`
            SELECT
                p.PatientID,
                ua.FirstName,
                ua.LastName,
                ua.Email,
                ua.Contact,
                ua.Gender,
                p.Age,
                p.Disease,
                b.BloodType,
                h.Name AS HospitalName,
                h.Location AS HospitalLocation,
                h.HospitalID
            FROM Patient p
            JOIN UserAccount ua ON p.PatientID = ua.UserID
            JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
            JOIN Hospital h ON p.HospitalID = h.HospitalID
            WHERE p.PatientID = ${patientId}
        `);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Patient profile not found' });
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const patientId = req.user?.userid;
        if (!patientId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await db.execute(sql`
            SELECT
                br.RequestID,
                br.Quantity,
                br.PatientDisease,
                br.RequestDate,
                br.FulfillmentStatus,
                b.BloodType,
                h.Name AS HospitalName
            FROM BloodRequest br
            JOIN BloodGroup b ON br.BloodGroupID = b.BloodGroupID
            JOIN Hospital h ON br.HospitalID = h.HospitalID
            WHERE br.PatientID = ${patientId}
            ORDER BY br.RequestDate DESC
        `);

        res.status(200).json({
            message: 'Requests retrieved successfully',
            data: Array.from(result)
        });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ message: 'Failed to retrieve requests', error: error.message });
    }
};

const createBloodRequest = async (req, res) => {
    try {
        const patientId = req.user?.userid;
        if (!patientId) return res.status(401).json({ message: 'Unauthorized' });

        const { bloodgroupid, quantity, patientdisease, hospitalid } = req.body;

        if (!bloodgroupid || !quantity || !patientdisease || !hospitalid) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await db.execute(sql`
            CALL sp_create_blood_request(
                ${patientId},
                ${hospitalid},
                ${bloodgroupid},
                ${quantity},
                ${patientdisease}
            )
        `);

        res.status(201).json({ message: 'Blood request submitted successfully' });
    } catch (error) {
        console.error('Create blood request error:', error);
        res.status(500).json({ message: 'Failed to submit request', error: error.message });
    }
};

export { getCompatibleBlood, searchByDisease, getBloodGroups, getHospitals, getMyProfile, getMyRequests, createBloodRequest }
