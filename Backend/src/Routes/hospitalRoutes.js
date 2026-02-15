const express = require('express');
const router = express.Router();
const { getNearbyHospitals, getDoctorByHospital } = require('../Controllers/hospitalController');
const { patientSessionAuth, isPatient } = require('../Middleware/authMiddleware');

//Nearby HOSPITALS
router.get('/nearbyHospitals', patientSessionAuth, isPatient, getNearbyHospitals);

//GET DOCTOR BY HOSPITAL
router.get('/:hospitalId/doctor', patientSessionAuth, isPatient, getDoctorByHospital);

module.exports = router;