const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const createUpload = require('../config/multerUploads');
const uploadPicture = createUpload('doctor')
const { doctorSessionAuth, isDoctor } = require('../Middleware/authMiddleware');
const { registerDoctor, loginDoctor, getAllDoctors, findDoctors, uploadProfilePicture } = require('../Controllers/doctorController');

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

// GET ALL DOCTORS
router.get('/getAlldoctors', getAllDoctors);

//SEARCH AND FILTER DOCTORS
router.get('/findDoctors', findDoctors)

//UPLOAD PROFILE PICTURE
router.put('/profile/image', doctorSessionAuth, isDoctor, uploadPicture.single('profile_picture'), uploadProfilePicture);

module.exports = router;