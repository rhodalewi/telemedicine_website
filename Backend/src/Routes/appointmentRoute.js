const express = require('express');
const { patientSessionAuth, isPatient } = require('../Middleware/authMiddleware');
const { body } = require('express-validator');
const { bookAppointment, specificDoctorAppointment, allAppointment, rescheduleAppointment, cancelAppointment} = require('../Controllers/appointmentController');
const router = express.Router();

//BOOK APPOINTMENT 
router.post('/bookAppointment', [
    body('appointment_date').isDate().withMessage('Valid date required'),
    body('appointment_time').isTime().withMessage('Valid time required')
], patientSessionAuth, isPatient, bookAppointment)

//ALL APPOINTMENT ROUTE
router.get('/allAppointment', patientSessionAuth, isPatient, allAppointment);

//RESCHEDULE APPOINTMENT
router.put('/rescheduleAppointment/:appointmentId', patientSessionAuth, isPatient, rescheduleAppointment);

//CANCEL APPOINTMENT
router.patch('/cancelAppointment/:appointmentId', patientSessionAuth, isPatient, cancelAppointment)

module.exports = router;