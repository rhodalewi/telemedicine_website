const express = require('express');
const { body } = require('express-validator'); 
const { patientSessionAuth, isPatient } = require('../Middleware/authMiddleware')
const createUpload = require('../config/multerUploads');
const uploadPicture = createUpload('patient');
const { registerPatient, loginPatient,  patientDashboard, editProfileDetails, updateProfileDetails, changePassword, resetPassword, uploadPatientImage, logout, deleteAccount} = require('../Controllers/patientController');
const router = express.Router();

//REGISTER ROUTE
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password_hash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').isMobilePhone('any').withMessage('Invalid phone number')
], registerPatient);

//LOGIN ROUTE
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password_hash').isEmpty().withMessage('Password is required')
], loginPatient);

//DASHBOARD ROUTE
router.get('/dashboard', patientSessionAuth, isPatient, patientDashboard);

//GET PROFILE FOR UPDATE FORM ROUTE
router.get('/updateProfile', patientSessionAuth, isPatient, editProfileDetails);

//UPDATE PROFILR DETAILS ROUTE
router.put('/updateProfile', patientSessionAuth, isPatient, updateProfileDetails);

//CHANGE PASSWORD ROUTE
router.put('/changePassword', patientSessionAuth, isPatient, changePassword);

//RESET PASSWORD ROUTE
router.put('/resetPassword', resetPassword);

//UPLOAD PROFILE PICTURE ROUTE
router.put('/profile/image', patientSessionAuth, isPatient, uploadPicture.single('profile_picture'), uploadPatientImage);

//LOGOUT ROUTE
router.get('/logout', logout);

//DELETE ACCOUNT ROUTE
router.delete('/delete-account', patientSessionAuth, isPatient, deleteAccount);

module.exports = router;