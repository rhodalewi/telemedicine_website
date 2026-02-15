const express = require('express');
const router = express.Router();
const { adminSessionAuth, isAdmin } = require('../Middleware/authMiddleware');
const { addHospital } = require('../Controllers/adminController');

// ADMIN ADD HOSPITAL ROUTE
router.post('/addHospital', adminSessionAuth, isAdmin, addHospital);


module.exports = router;