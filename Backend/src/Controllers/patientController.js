const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const path = require('path');
const fs = require('fs');
const { createNotifications } = require('../utils/notification');

//PATIENT REGISTRATION
exports.registerPatient = async (req, res) => {
    //validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    };

    const patientId = req.session.patientId;
    if (patientId) {
        return res.status(400).json({ message: 'You are already logged in' });
    } 

    const { first_name, last_name, email, password_hash, phone, date_of_birth, gender } = req.body;
    
    try {
        //query to check if email already exists
        const [patient] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
        if (patient.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password_hash, 10);

        //insert new patient into database
        await db.execute('INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender) VALUES ( ?, ?, ?, ?, ?, ?, ?)', [
            first_name, last_name, email, hashedPassword, phone, date_of_birth, gender
        ]);
       
        res.status(200).json({ message: 'Registration successful!' });

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Registration failed. Try again!', error: err.message });
    }
};

//PATIENT LOGIN
exports.loginPatient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    };
    
    const { email, password } = req.body;

    try {
        //check if patient exist
        const [patient] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);

        if (patient.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        //compare password
        const comparePassword = await bcrypt.compare(password, patient[0].password_hash);
        if (!comparePassword) return res.status(400).json({ message: 'Wrong password. Please input the correct password' });

        //create session
        req.session.patientId = patient[0].patient_id;
        req.session.role = 'patient';

        return res.status(200).json({
            message: 'Login successful. Redirecting...', patient: {
                id: patient[0].patient_id,
                first_name: patient[0].first_name,
                last_name: patient[0].last_name,
                email: patient[0].email,

            }
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Login failed. Try again!', error: error.message });
    }
};

//PATIENT DASHBOARD
exports.patientDashboard = async (req, res) => {
    const patientId = req.session.patientId;

    try {
            // QUERIES
        const [patient] = await db.execute('SELECT * FROM patients WHERE patient_id = ?', [patientId])
        const [notificationResult] = await db.execute('SELECT COUNT(*) AS count FROM notifications WHERE patient_id = ? AND is_read = 0', [patientId]);
        const [upcomingAppointmentData] = await db.execute('SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ? AND status IN ("booked", "rescheduled") AND appointment_date >= CURDATE()', [patientId]);
        const [totalAppointmentData] = await db.execute('SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ?', [patientId]);
        const [doctorsConsulted] = await db.execute('SELECT COUNT(doctor_id) AS doctors_consulted FROM appointments WHERE patient_id = ? AND status = ("completed")', [patientId]);
        const [appointmentHistory] = await db.execute(
            `SELECT 
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                a.status,
                d.first_name AS doctor_firstname,
                d.last_name AS doctor_lastname,
                d.specialization AS doctor_specialization,
                d.profile_picture AS doctor_profilepicture
            FROM
                appointments a
            JOIN
                doctors d
            ON
                a.doctor_id = d.doctor_id
            WHERE
                a.patient_id = ?
            AND
                a.status
            IN
                ("completed", "cancelled")
            ORDER BY
                a.appointment_date
            DESC LIMIT 2`,
            [patientId]
        );

        const lastVisit = patient[0].last_visit;

        if(!lastVisit) return res.status(400).json({message: 'First Time'})

        await db.execute('UPDATE patients SET last_visit = NOW() WHERE patient_id = ?', [patientId])

        if (patient.length === 0) {
            return res.status(400).json({message: 'Patient not found'})
        };



        return res.status(200).json({
            patientResult: patient[0],
            notificationCount: notificationResult[0].count,
            upcomingAppointmentCount: upcomingAppointmentData[0].count,
            totalAppointmentCount: totalAppointmentData[0].count,
            doctorsConsulted: doctorsConsulted[0].doctors_consulted,
            appointmentHistory: appointmentHistory,
            lastVisit
        })
     
    } catch (error) {
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
};

exports.editProfileDetails = async (req, res) => {
    const patientId = req.session.patientId;

    try {
        const [patient] = await db.execute('SELECT patient_id, first_name, last_name, email, phone, gender, emergency_contact, address FROM patients WHERE patient_id = ?', [patientId]);

        return res.status(200).json(patient[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch Profile!' })
    }
};

//UPDATE PROFILE DETAILS
exports.updateProfileDetails = async (req, res) => {
    const patientId = req.session.patientId;
    const { first_name, last_name, phone, date_of_birth, gender, address, emergency_contact } = req.body;

    try {
        await db.execute('UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?, emergency_contact = ? WHERE patient_id = ?', [first_name, last_name, phone, date_of_birth, gender, address, emergency_contact, patientId]);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Profile Updated Successfully',
            'Your profile details have been updated successfully'
        );

        return res.status(200).json({ message: 'Profile updated successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update failed, try again!', error: error.message });
    }
};

//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    const patientId = req.session.patientId;
    const {currentPassword, newPassword } = req.body;
    try {
        const [patient] = await db.execute('SELECT password_hash FROM patients WHERE patient_id = ?', [patientId]);
        if (patient[0].length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        };

        //compare password
        const comparePassword = await bcrypt.compare(currentPassword, patient[0].password_hash);
        if (!comparePassword) {
            return res.status(400).json({ message: 'Current password is incorrect!' });
        };

        //hash new password
        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE patients SET password_hash = ? WHERE patient_id = ?', [hashNewPassword, patientId]);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Password Changed Successfully',
            'Your account password has been changed successfully. If you did not make this change, please contact support immediately!'
        );

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password, try again!', error: error.message });
    };
};

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
    /* const { email } = req.params; */
    const {email, newPassword } = req.body;
    try {
        const [patient] = await db.execute('SELECT patient_id, email FROM patients WHERE email = ?', [email]);
    
        if (patient.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        };

        //hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE patients SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Password reset failed. Try again!', error: error.message });
    };
};

//UPLOAD PROFILE PICTURE
exports.uploadPatientImage = async (req, res) => {
    const patientId = req.session.patientId;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    };
    const profilePicturePath = req.file.filename;

    try {
        //remove old image
        const [oldImages] = await db.execute(`SELECT profile_picture FROM patients WHERE patient_id = ?`, [patientId]);
        const oldImage = oldImages[0].profile_picture;
        if (oldImage) {
            const oldImaagePath = path.join(__dirname, '../uploads/patient', oldImage);
            
            if (fs.existsSync(oldImaagePath)) {
                fs.unlinkSync(oldImaagePath);
            };
        };

        await db.execute('UPDATE patients SET profile_picture = ? WHERE patient_id = ?', [profilePicturePath, patientId]);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Profile Picture Updated Successfully',
            'Your profile picture has been updated successfully'
        );

        return res.status(200).json({ message: 'Image uploaded successfully', Image: profilePicturePath });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Upload failed. Try again!', error: error.message });
    }
};

//PATIENT LOGOUT
exports.logout = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.clearCookie('telemedicine.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Logout failed. Try again!', error: error.message })
    }
};

//DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
    const patientId = req.session.patientId;

    try {
        await db.execute('DELETE FROM patients WHERE patient_id = ?', [patientId]);
        req.session.destroy(() => {
            res.clearCookie('telemedicine.sid');
            res.status(200).json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete account. Try again!', error: error.message });
    }
};