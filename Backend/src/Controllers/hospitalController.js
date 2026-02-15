const db = require('../config/database');

//GET NEARBY HOSPITALS
exports.getNearbyHospitals = async (req, res) => {
    try {
        const [hospital] = await db.execute(`SELECT * FROM hospitals`);

        return res.status(200).json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch hospitals', error: error.message });
    }
};

exports.getDoctorByHospital = async (req, res) => {
    const { hospitalId } = req.params;

    try {
        const [doctors] = await db.execute('SELECT doctor_id, first_name, last_name, specialization, profile_picture FROM doctors WHERE hospital_id = ? ORDER BY first_name ASC', [hospitalId]);
        if (doctors.length === 0) return res.status(400).json({ message: 'No doctors found for this hospital' });
        return res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting doctors', error: error.message })
    }
};