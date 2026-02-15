const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/database');

//DOCTOR REGISTRATION
exports.registerDoctor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    };

    try {
        const { first_name, last_name, email, phone, password_hash, specialization, yearsExperience } = req.body;

        /* check if email exist */
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
        if (doctor.length > 0) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password_hash, 10);

        await db.execute('INSERT INTO doctors (first_name, last_name, email, phone, password_hash, specialization, yearsExperience) VALUES(?, ?, ?, ?, ?, ?, ?)', [
            first_name, last_name, email, phone, hashedPassword, specialization, yearsExperience
        ]);

        res.status(200).json({ message: 'Registration successful!' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed. Try again!', error: error.message });
    };
};


//DOCTOR LOGIN
exports.loginDoctor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg })
    };

    try {
        const { email, password } = req.body
        //check if email exist
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
        if (doctor.length === 0) return res.status(400).json({ message: 'User not found' });

        //compare password
        const comparePassword = await bcrypt.compare(password, doctor[0].password_hash);
        if (!comparePassword) return res.status(400).json({ message: 'Wrond password, please input the correct password' });

        req.session.doctorId = doctor[0].id
        req.session.role = 'patient'

        res.status(200).json({
            message: 'Login successfull. Redirecting...', patient: {
                id: doctor[0].id,
                first_name: doctor[0].first_name,
                email: doctor[0].email
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login failed!', error: error.message })
    }
};

//GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.execute('SELECT * FROM doctors ORDER BY first_name ASC');
        const [specializations] = await db.execute('SELECT DISTINCT specialization FROM doctors ORDER BY specialization ASC');
       
        return res.status(200).json(doctors, specializations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors', error: error.message })
    }
};

//SEARCH AND FILTER DOCTOR
exports.findDoctors = async (req, res) => {
    const { search, filter } = req.query;

    try {
        let query = 'SELECT doctor_id, first_name, last_name, specialization, email, yearsExperience, start_time, end_time, available_day, profile_picture FROM doctors WHERE 1=1';
        const params = [];
        if (search) {
            query += ' AND (CONCAT(first_name, " ", last_name) LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`)
        };

        if (filter && filter !== 'Select Specialization') {
            query += ' AND specialization = ?';
            params.push(filter);
        };

        query += ' ORDER BY first_name ASC';
        const [searchDoctors] = await db.execute(query, params);
        return res.status(200).json(searchDoctors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Search failed, Please try again!' })
    }
};

//UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        };
        const imagePath = `/upload/doctor/${req.file.filename}`;

        await db.execute('UPDATE doctors SET profile_picture = ? WHERE doctor_id = ?', I[imagePath, req.param.id]);
        return res.status(200).json({ message: 'Image uploaded successfully', imagePath })
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Failed to upload image!', error: error.message });
    }
};

/* const handleUpload = async (doctorId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    await api.post(`/doctors/${doctorId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}; */
