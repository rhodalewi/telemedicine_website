const express = require('express');
const { isAuthenticated, authorizeRoles } = require('../Middleware/authMiddleware');
const { body } = require('express-validator');
const { bookAppointment, allAppointment, rescheduleAppointment, cancelAppointment} = require('../Controllers/appointmentController');
const router = express.Router();

//BOOK APPOINTMENT 
router.post('/bookAppointment', [
    body('appointment_date').isDate().withMessage('Valid date required'),
    body('appointment_time').isTime().withMessage('Valid time required')
], isAuthenticated, authorizeRoles('patient', 'doctor'), bookAppointment)

//ALL APPOINTMENT ROUTE
router.get('/allAppointment', isAuthenticated, authorizeRoles('patient', 'doctor'), allAppointment);

//RESCHEDULE APPOINTMENT
router.put('/rescheduleAppointment/:appointmentId', isAuthenticated, authorizeRoles('patient'), rescheduleAppointment);

//CANCEL APPOINTMENT
router.patch('/cancelAppointment/:appointmentId', isAuthenticated, authorizeRoles('patient'), cancelAppointment);

module.exports = router;