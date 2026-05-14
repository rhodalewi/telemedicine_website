const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles} = require('../Middleware/authMiddleware');
const { addHospital } = require('../Controllers/adminController');

// ADMIN ADD HOSPITAL ROUTE
router.post('/addHospital', isAuthenticated, authorizeRoles('admin'), addHospital);


module.exports = router;