import { searchDonorByBloodType, getDonorHistory, updateDonorRating, getAverageDonationsPerDonor, getDonorsNeverTested } from '../models/donor.js'
import db from '../config/db.js';
import { sql } from 'drizzle-orm';

const searchDonors = async (req, res) => {
    try {
        const { bloodtype } = req.body

        if (!bloodtype) {
            return res.status(400).json({ message: "Blood type is required" })
        }

        const result = await searchDonorByBloodType(bloodtype)

        res.status(200).json({
            message: "Donor search successful",
            data: result
        })
    } catch (error) {
        console.error("Donor search error: ", error)
        res.status(500).json({
            message: "Donor search failed",
            error: error.message
        })
    }
}

const getDonations = async (req, res) => {
    try {
        const { donorid } = req.body

        if (!donorid) {
            return res.status(400).json({ message: "Donor ID is required" })
        }

        const result = await getDonorHistory(donorid)

        res.status(200).json({
            message: "Donor history retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get donor history error: ", error)
        res.status(500).json({
            message: "Failed to retrieve donor history",
            error: error.message
        })
    }
}

const rateDonor = async (req, res) => {
    try {
        const { donorid, rating } = req.body

        if (!donorid || rating === undefined) {
            return res.status(400).json({ message: "Donor ID and rating are required" })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" })
        }

        await updateDonorRating(donorid, rating)

        res.status(200).json({
            message: "Donor rating updated successfully"
        })
    } catch (error) {
        console.error("Rate donor error: ", error)
        res.status(500).json({
            message: "Failed to update donor rating",
            error: error.message
        })
    }
}

const getAverageDonations = async (req, res) => {
    try {
        const result = await getAverageDonationsPerDonor()

        res.status(200).json({
            message: "Average donations per donor retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get average donations error: ", error)
        res.status(500).json({
            message: "Failed to retrieve average donations",
            error: error.message
        })
    }
}

const getNeverTested = async (req, res) => {
    try {
        const result = await getDonorsNeverTested()

        res.status(200).json({
            message: "Donors never tested retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get donors never tested error: ", error)
        res.status(500).json({
            message: "Failed to retrieve donors never tested",
            error: error.message
        })
    }
}

const getBloodGroups = async (req, res) => {
    try {
        const result = await db.execute(sql`SELECT * FROM BloodGroup ORDER BY BloodType`)

        res.status(200).json({
            message: "Blood groups retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get blood groups error: ", error)
        res.status(500).json({
            message: "Failed to retrieve blood groups",
            error: error.message
        })
    }
}

export { searchDonors, getDonations, rateDonor, getAverageDonations, getNeverTested, getBloodGroups }
