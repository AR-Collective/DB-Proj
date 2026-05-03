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

export { getCompatibleBlood, searchByDisease, getBloodGroups, getHospitals }
