const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const createUpload = require('../config/multerUploads');
const uploadPicture = createUpload('doctor')
const { isAuthenticated, authorizeRoles } = require('../Middleware/authMiddleware');
const { registerDoctor, loginDoctor, doctorDashboard, doctorAllAppointments, getAllDoctors, findDoctors, uploadDoctorImage, doctorTodaySchedule } = require('../Controllers/doctorController');

//REGISTRATION ROUTE
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password_hash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').isMobilePhone('any').withMessage('Invalid phone number')
],  registerDoctor);

//LOGIN ROUTE
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password_hash').isEmpty().withMessage('Password is required')
], loginDoctor);

//DASHBOARD ROUTE
router.get('/dashboard', isAuthenticated, authorizeRoles('doctor'), doctorDashboard);

//GET ALL APOINTMENTS FOR DOCTOR
router.get('/doctorAllAppointments', isAuthenticated, authorizeRoles('doctor'), doctorAllAppointments)

// GET ALL DOCTORS
router.get('/getAlldoctors', getAllDoctors);

//SEARCH AND FILTER DOCTORS
router.get('/findDoctors', findDoctors)

//UPLOAD PROFILE PICTURE
router.put('/profile/image', isAuthenticated, authorizeRoles('doctor'), uploadPicture.single('profile_picture'), uploadDoctorImage);

//GET APPOINTMENT FOR A DOCTOR TODAY'S SCHEDULE
router.get('/doctorTodaySchedule/', isAuthenticated, doctorTodaySchedule);

//ALL APPOINTMENT
/* router.get('allDoctorAppointment') */

module.exports = router;