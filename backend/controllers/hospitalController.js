import { getHospitalVsAvailableStock, getStaffProfile as getStaffProfileModel } from '../models/hospital.js';

const getHospitalStock = async (req, res) => {
    try {
        const result = await getHospitalVsAvailableStock()

        res.status(200).json({
            message: "Hospital vs available stock retrieved successfully",
            data: result
        })
    } catch (error) {
        console.error("Get hospital stock error: ", error)
        res.status(500).json({
            message: "Failed to retrieve hospital stock comparison",
            error: error.message
        })
    }
}

const getStaffProfile = async (req, res) => {
    try {
        const staffId = req.user?.userid;
        if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

        const result = await getStaffProfileModel(staffId);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Staff profile not found' });
        }

        res.status(200).json({ message: 'Profile retrieved successfully', data: result[0] });
    } catch (error) {
        console.error('Get staff profile error:', error);
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
};

export { getHospitalStock, getStaffProfile }
