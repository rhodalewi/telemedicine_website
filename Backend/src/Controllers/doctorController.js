const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const fs = require('fs');
const { createNotifications, getRecentNotification } = require('../utils/notification');

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
        if (!comparePassword) {
            return res.status(400).json({ message: 'Wrond password, please input the correct password' })
        };

        
        req.session.user = {
            id: doctor[0].doctor_id,
            role: 'doctor'
        }

        res.status(200).json({
            message: 'Login successfull. Redirecting...', doctor: {
                id: doctor[0].doctor_id,
                first_name: doctor[0].first_name,
                last_name: doctor[0].last_name,
                email: doctor[0].email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Login failed!', error: error.message })
    }
};

//DOCTOR DASHBOARD
exports.doctorDashboard = async (req, res) => {
    const doctorId = req.session.user.id;

    try {
        const [doctorData] = await db.execute('SELECT * FROM doctors WHERE doctor_id = ?', [doctorId]);

        //Today's appointment
        const [todayAppointment] = await db.execute('SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND appointment_date = CURDATE() AND status IN ("booked", "rescheduled")', [doctorId]);

        //upcoming appointment
        const [upcomingAppointment] = await db.execute('SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND status IN ("booked", "rescheduled") AND appointment_date >= CURDATE()', [doctorId]);
        //total patients
        const [totalPatients] = await db.execute('SELECT COUNT(DISTINCT patient_id) AS count FROM appointments WHERE doctor_id = ? AND status = "completed"', [doctorId]);

        //total appointments
        const [totalAppointments] = await db.execute('SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ?', [doctorId]);

        //last visit
        await db.execute('UPDATE doctors SET last_visit = NOW() WHERE doctor_id = ?', [doctorId]);
        const lastVisit = doctorData[0].last_visit;

        //Recent Notification
        const recentNotifications = await getRecentNotification(doctorId, 'doctor')
    
        return res.status(200).json({
            doctorResult: doctorData[0],
            todayAppointment: todayAppointment[0].count,
            upcomingAppointment: upcomingAppointment[0].count,
            totalPatients: totalPatients[0].count,
            totalAppointments: totalAppointments[0].count,
            lastVisit: lastVisit,
            recentNotifications
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, please try again!', error: error.message });
    }
};

//GET ALL DOCTORS APPOINTMENT
exports.doctorAllAppointments = async (req, res) => {
    const doctorId = req.session.user.id;

    try {
        const [allAppointments] = await db.execute(`
            SELECT
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                CASE 
                    WHEN a.status = 'booked' 
                    OR a.status = 'rescheduled' 
                    THEN 'upcoming' 
                    ELSE a.status 
                END AS status,
                a.reason,
                p.first_name,
                p.last_name,
                p.gender,
                p.date_of_birth,
                p.profile_picture AS patientPicture
            FROM 
                appointments a
            JOIN 
                patients p
            ON 
                a.patient_id = p.patient_id
            WHERE
                a.doctor_id = ?
            ORDER BY a.appointment_date ASC
        `, [doctorId]);
        
        return res.status(200).json(allAppointments)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointment', error: error.message })
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
exports.uploadDoctorImage = async (req, res) => {
    const doctorId = req.session.user.id;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    };
    try {
        const imagePath = `/upload/doctor/${req.file.filename}`;
        //remove old image
        const [oldImages] = await db.execute(`SELECT profile_picture FROM patients WHERE doctor_id = ?`, [doctorId]);
        const oldImage = oldImages[0].profile_picture;
        if (oldImage) {
            const oldImaagePath = path.join(__dirname, '../uploads/doctor', oldImage);
            
            if (fs.existsSync(oldImaagePath)) {
                fs.unlinkSync(oldImaagePath);
            };
        };

        //insert new image
        await db.execute('UPDATE doctors SET profile_picture = ? WHERE doctor_id = ?', [imagePath, doctorId]);

        //create notification
        await createNotifications({
            user_id: doctorId,
            user_role: 'doctor',
            title: 'Profile Picture Updated Successfully',
            message: 'Your profile picture has been updated successfully'
        })
        return res.status(200).json({ message: 'Image uploaded successfully', imagePath })
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Failed to upload image!', error: error.message });
    }
};

//GET APPOINTMENT FOR A DOCTOR TODAY'S SCHEDULE
exports.doctorTodaySchedule = async (req, res) => {
    const doctorId = req.session.user.id;

    try {
        const [todayAppointments] = await db.execute('SELECT a.appointment_id, a.appointment_date, a.appointment_time, CASE WHEN a.status = "booked" OR a.status = "rescheduled" THEN "upcoming" ELSE a.status END AS status, p.first_name AS patient_firstname, p.last_name AS patient_lastname, p.profile_picture AS patientpicture FROM appointments a JOIN patients p ON a.patient_id = p.patient_id WHERE a.doctor_id = ? AND a.appointment_date = CURDATE() ORDER BY a.appointment_time ASC', [doctorId]);

        //All Apointments
        /* const [allAppointments] = await db.execute('SELECT ') */

        return res.status(200).json(todayAppointments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching today's appointments", error: error.message });
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
