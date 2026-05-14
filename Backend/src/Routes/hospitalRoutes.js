const express = require('express');
const router = express.Router();
const { getNearbyHospitals, getDoctorByHospital } = require('../Controllers/hospitalController');
const { isAuthenticated, authorizeRoles } = require('../Middleware/authMiddleware');

//Nearby HOSPITALS
router.get('/nearbyHospitals', isAuthenticated, authorizeRoles('patient'), getNearbyHospitals);

//GET DOCTOR BY HOSPITAL
router.get('/:hospitalId/doctor', isAuthenticated, authorizeRoles('patient'), getDoctorByHospital);

module.exports = router;